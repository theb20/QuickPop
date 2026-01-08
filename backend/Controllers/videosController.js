import { ensureVideosTable, findByCategory, incrementViews as incViewsModel, getLatestVideosPerCategory, getFeaturedVideos, getTrendingVideos, getVideoById, updateVideoUrlInDb } from '../models/videosModel.js'
import { addRating, getVideoRating } from '../models/ratingsModel.js'
import { findAll, findById, createOne, updateOne, removeOne } from '../models/baseModel.js'
import { findTrainingByVideoId, createTrainingFromVideo, updateUserTrainingProgress } from '../models/trainingsModel.js'
import { awardCertificateForTraining } from '../models/certificationsModel.js'
import { createBroadcastNotification, createNotification } from '../models/notificationsModel.js'
import { google } from 'googleapis'
import { Readable } from 'stream'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fetch from 'node-fetch' // Using node-fetch for streaming

const TABLE = 'videos'
const ALLOWED = [
  'title','description','video_url','thumbnail_url','cloud_provider','cloud_file_id','cloud_bucket',
  'duration','file_size','resolution','format','bitrate','views_count','category_id','uploaded_by',
  'is_public','processing_status', 'is_featured', 'is_trending', 'certification_id'
]

export async function initVideosController() {
  await ensureVideosTable()
}

export async function listVideos(req, res) {
  try {
    const limit = Number(req.query.limit || 50)
    const offset = Number(req.query.offset || 0)
    
    if (req.query.category_id) {
      const rows = await findByCategory(req.query.category_id, { limit, offset })
      return res.json(rows)
    }

    const rows = await findAll(TABLE, { limit, offset })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getVideo(req, res) {
  try {
    const id = Number(req.params.id)
    const row = await getVideoById(id)
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createVideo(req, res) {
  try {
    const videoData = { ...(req.body || {}) }

    // Cast Booleans from FormData strings
    if (videoData.is_featured === 'true') videoData.is_featured = 1
    if (videoData.is_featured === 'false') videoData.is_featured = 0
    if (videoData.is_trending === 'true') videoData.is_trending = 1
    if (videoData.is_trending === 'false') videoData.is_trending = 0

    const id = await createOne(TABLE, videoData, { allowed: ALLOWED })
    const created = await getVideoById(id)

    // Notify all users about new video
    try {
        console.log('Starting video broadcast notification...');
        await createBroadcastNotification({
            title: 'Nouvelle Vidéo Disponible !',
            body: `Découvrez "${created.title}" dans la catégorie ${created.category_name || 'récente'}.`,
            type: 'success',
            url: `/app/play?id=${created.id}`
        });
        console.log('Video broadcast DB creation successful.');
        
        // Emit via Socket.io if available
        if (req.io) {
             console.log('Emitting socket notification for video...');
             req.io.emit('notification', {
                id: Date.now(),
                title: 'Nouvelle Vidéo Disponible !',
                body: `Découvrez "${created.title}" dans la catégorie ${created.category_name || 'récente'}.`,
                type: 'success',
                url: `/app/play?id=${created.id}`,
                created_at: new Date()
             });
             console.log('Socket notification emitted.');
        } else {
             console.error('req.io is not defined!');
        }
    } catch (notifErr) {
        console.error('Failed to send video notification', notifErr);
    }

    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateVideo(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await updateOne(TABLE, id, req.body || {}, { allowed: ALLOWED })
    if (!ok) return res.status(400).json({ error: 'Aucune modification' })
    const updated = await findById(TABLE, id)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteVideo(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await removeOne(TABLE, id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function incrementVideoViews(req, res) {
  try {
    const id = Number(req.params.id)
    const ok = await incViewsModel(id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(200).json({ message: 'Views incremented' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function rateVideo(req, res) {
  try {
    const videoId = Number(req.params.id)
    const userId = req.user.id
    const { score } = req.body

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' })
    }

    await addRating(videoId, userId, score)
    const newStats = await getVideoRating(videoId)
    
    res.json({ success: true, ...newStats })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getLatestByCategory(req, res) {
  try {
    const limit = Number(req.query.limit || 6)
    const rows = await getLatestVideosPerCategory(limit)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getFeatured(req, res) {
  try {
    const limit = Number(req.query.limit || 10)
    const rows = await getFeaturedVideos(limit)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getTrending(req, res) {
  try {
    const limit = Number(req.query.limit || 10)
    const rows = await getTrendingVideos(limit)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateVideoProgress(req, res) {
  try {
    const videoId = Number(req.params.id)
    const userId = req.user.id
    const { progress, currentTime, duration } = req.body // progress is percentage (0-100)

    // 0. Update video duration if provided and missing
    if (duration) {
        const video = await findById(TABLE, videoId)
        if (video && !video.duration) {
            await updateOne(TABLE, videoId, { duration: Math.floor(duration) }, { allowed: ['duration'] })
        }
    }

    // 1. Find or create training
    let training = await findTrainingByVideoId(videoId)
    if (!training) {
      const video = await findById(TABLE, videoId)
      if (!video) return res.status(404).json({ error: 'Video not found' })
      const trainingId = await createTrainingFromVideo(video)
      training = { id: trainingId }
    }

    // 2. Determine status
    const status = progress >= 90 ? 'completed' : (progress > 0 ? 'in_progress' : 'not_started')

    // 3. Update progress
    await updateUserTrainingProgress(userId, training.id, progress, status)

    // 4. Award certificate if completed
    let certificateAwarded = false
    if (status === 'completed') {
        let title = training.title
        if (!title) {
            const fullTraining = await findById('trainings', training.id)
            title = fullTraining ? fullTraining.title : null
        }
        
        if (title) {
            certificateAwarded = await awardCertificateForTraining(userId, title)
            
            if (certificateAwarded && req.io) {
                try {
                    const notif = await createNotification(userId, {
                        title: 'Certification obtenue !',
                        body: `Félicitations ! Vous avez obtenu la certification : ${title}`,
                        type: 'success',
                        url: '/certifications'
                    })
                    req.io.to(`user_${userId}`).emit('notification', notif)
                } catch(e) {
                    console.error("Failed to notify", e)
                }
            }
        }
    }

    return res.json({ success: true, status, certificateAwarded })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Helper: Buffer to Stream
function bufferToStream(buffer) {
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}

// Helper: Get Drive Client
function getDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Drive credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN) missing')
  }

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  oAuth2Client.setCredentials({ refresh_token: refreshToken })
  return google.drive({ version: 'v3', auth: oAuth2Client })
}

// Helper: Get S3/Backblaze Client
function getS3Client() {
  const endpoint = process.env.B2_ENDPOINT ? process.env.B2_ENDPOINT.trim() : '';
  const region = process.env.B2_REGION ? process.env.B2_REGION.trim() : 'us-west-000';
  const accessKeyId = process.env.B2_KEY_ID ? process.env.B2_KEY_ID.trim() : '';
  const secretAccessKey = process.env.B2_APP_KEY ? process.env.B2_APP_KEY.trim() : '';

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Backblaze B2 credentials (B2_ENDPOINT, B2_KEY_ID, B2_APP_KEY) missing');
  }

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

export async function uploadVideoFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    let videoUrl = ''
    let cloudProvider = ''
    let cloudFileId = ''
    let cloudBucket = ''

    // 🔥 BACKBLAZE B2 UPLOAD STRATEGY
    if (process.env.B2_APP_KEY) {
      console.log('🚀 Starting Backblaze B2 Upload...')
      const s3 = getS3Client()
      const bucketName = process.env.B2_BUCKET_NAME
      
      if (!bucketName) throw new Error('B2_BUCKET_NAME is missing')

      const key = `${Date.now()}_${req.file.originalname}`
      
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: bufferToStream(req.file.buffer),
          ContentType: req.file.mimetype,
        },
      });

      upload.on('httpUploadProgress', (progress) => {
        console.log(`📡 Upload Progress: ${progress.loaded} / ${progress.total}`);
      });

      const result = await upload.done();
      console.log('✅ Backblaze Upload Success:', result.Location);

      cloudFileId = key;
      cloudProvider = 'backblaze';
      cloudBucket = bucketName;
      
      // Construct Video URL
      // Use proxy endpoint to handle streaming or private buckets if needed
      // But for now we can try to return the Location if it's public, or the proxy URL
      
      // Standard Proxy URL
      // This ensures we can control headers, range requests, etc.
      const baseUrl = process.env.API_URL || 'http://localhost:3000'; // Fallback
      // Actually we will just store a reference URL that the frontend can use or the proxy can interpret
      
      // Let's store the Proxy URL as the main video_url so the frontend works out of the box
      // videoUrl = `${baseUrl}/videos/proxy/${key}?provider=backblaze`
      
      // Wait, let's use the absolute URL if it's public, otherwise proxy.
      // Ideally, B2 presigned URLs or public URLs are better for performance than proxying through our Node server.
      // But user might want to hide the bucket URL.
      // Let's stick to the proxy pattern used in this app for consistency, BUT optimize:
      // If we use the proxy, we stream through Node.
      
      // Let's use the proxy URL format that the frontend expects?
      // The frontend uses `video_url`.
      // If we want to use the proxy streaming controller:
      videoUrl = `video-proxy://backblaze/${key}`; // Internal protocol or just use relative path?
      // Let's just use the direct location if available, or construct a proxy link.
      
      // For simplicity and performance, let's try to generate a Signed URL valid for 7 days? 
      // Or just use the proxy.
      // Given the previous code proxied Drive/Dropbox, let's proxy B2 too for consistency and CORS handling.
      
      // We'll construct a special URL that our proxy endpoint recognizes
      // Or just store the key and let the frontend/backend handle it.
      // But the database expects a full URL usually.
      
      // Let's construct a self-hosting proxy URL
      // We don't have `req.protocol` and `req.get('host')` easily in all envs (behind nginx etc), but we can try.
      // Actually, let's just store the B2 Direct URL if possible, but the user asked to replace Dropbox.
      
      // Use relative URL so it works via Proxy from any device (localhost or IP)
      // The frontend Vite proxy or Nginx will forward /videos/proxy to the backend
      videoUrl = `/videos/proxy/${key}?provider=backblaze`

    } 
    // ☁️ GOOGLE DRIVE FALLBACK
    else {
        const drive = getDriveClient()
        
        // Metadata
        const fileMetadata = {
          name: req.file.originalname,
        }
        if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
          fileMetadata.parents = [process.env.GOOGLE_DRIVE_FOLDER_ID]
        }

        // Media
        const media = {
          mimeType: req.file.mimetype,
          body: bufferToStream(req.file.buffer)
        }

        // Upload
        const response = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id, webViewLink, webContentLink'
        })

        cloudFileId = response.data.id
        cloudProvider = 'google_drive'

        // Make Public
        await drive.permissions.create({
          fileId: cloudFileId,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        })

        // Construct Video URL
      // Use proxy endpoint to handle streaming for Google Drive
      const baseUrl = process.env.API_URL || 'http://localhost:3000';
      
      // Store the proxy URL in database
      // This way, the frontend will simply request this URL, and our backend will stream it
      videoUrl = `/videos/proxy/${cloudFileId}?provider=google_drive`;
    }

    // Create DB Entry
    const videoData = {
      ...req.body,
      title: req.body.title || req.file.originalname,
      video_url: videoUrl,
      cloud_provider: cloudProvider,
      cloud_file_id: cloudFileId,
      cloud_bucket: cloudBucket
    }

    // Cast Booleans
    if (videoData.is_featured === 'true') videoData.is_featured = 1
    if (videoData.is_featured === 'false') videoData.is_featured = 0
    if (videoData.is_trending === 'true') videoData.is_trending = 1
    if (videoData.is_trending === 'false') videoData.is_trending = 0

    // Clean up req.body fields if they are sent as strings "null" or "undefined"
    Object.keys(videoData).forEach(key => {
      if (videoData[key] === 'null' || videoData[key] === 'undefined') {
        delete videoData[key]
      }
    })

    const id = await createOne(TABLE, videoData, { allowed: ALLOWED })
    const created = await getVideoById(id)

    // Notify all users about new video
    try {
        console.log('Starting video broadcast notification (upload)...');
        await createBroadcastNotification({
            title: 'Nouvelle Vidéo Disponible !',
            body: `Découvrez "${created.title}" dans la catégorie ${created.category_name || 'récente'}.`,
            type: 'success',
            url: `/app/play?id=${created.id}`
        });
        console.log('Video broadcast DB creation successful (upload).');
        
        // Emit via Socket.io if available
        if (req.io) {
             console.log('Emitting socket notification for video (upload)...');
             req.io.emit('notification', {
                id: Date.now(),
                title: 'Nouvelle Vidéo Disponible !',
                body: `Découvrez "${created.title}" dans la catégorie ${created.category_name || 'récente'}.`,
                type: 'success',
                url: `/app/play?id=${created.id}`,
                created_at: new Date()
             });
             console.log('Socket notification emitted (upload).');
        } else {
             console.error('req.io is not defined (upload)!');
        }
    } catch (notifErr) {
        console.error('Failed to send video notification (upload)', notifErr);
    }
    
    res.status(201).json(created)

  } catch (err) {
    console.error('Upload Error:', err)
    res.status(500).json({ error: err.message })
  }
}

// PROXY STREAMING for Google Drive, Dropbox AND Backblaze
export async function streamVideo(req, res) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] 🎬 Stream Request Incoming`);
  
  try {
    const fileId = req.params.id
    const provider = req.query.provider || 'google_drive'
    const externalUrl = req.query.url

    console.log(`[${requestId}] Params: fileId=${fileId}, provider=${provider}`);
    if (externalUrl) console.log(`[${requestId}] External URL: ${externalUrl}`);

    // ☁️ GOOGLE DRIVE PROVIDER
    if (provider === 'google_drive') {
        console.log(`[${requestId}] ☁️ Provider: Google Drive`);
        const drive = getDriveClient()

        // Get file info for size
        const fileInfo = await drive.files.get({
            fileId: fileId,
            fields: 'size, mimeType'
        });
        
        const fileSize = parseInt(fileInfo.data.size);
        console.log(`[${requestId}] 📦 File Size: ${fileSize} bytes`);

        const range = req.headers.range;
        if (range) {
            console.log(`[${requestId}] 📏 Range Requested: ${range}`);
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;

            console.log(`[${requestId}] ✂️ Serving bytes ${start}-${end} (${chunksize} bytes)`);

            const headers = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4', // Force MP4 for better browser support
            };
            res.writeHead(206, headers);

            const stream = await drive.files.get({
                fileId: fileId,
                alt: 'media'
            }, {
                headers: { "Range": `bytes=${start}-${end}` },
                responseType: 'stream'
            });

            stream.data.pipe(res);
            stream.data.on('end', () => console.log(`[${requestId}] ✅ Chunk Sent`));
            stream.data.on('error', (err) => console.error(`[${requestId}] ❌ Stream Error:`, err));

        } else {
            console.log(`[${requestId}] 📦 Full File Requested`);
            const headers = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, headers);

            const stream = await drive.files.get({
                fileId: fileId,
                alt: 'media'
            }, { responseType: 'stream' });

            stream.data.pipe(res);
        }
        return;
    }

    // 🔗 UNIVERSAL URL RELAY (For Shared Links without File ID)
    if (fileId === 'external' && externalUrl) {
        console.log(`[${requestId}] 🔗 Starting Proxy Relay...`);
        
        let targetUrl = externalUrl;
        
        // Optimize Dropbox Links for Direct Stream
        if (targetUrl.includes('dropbox.com')) {
            try {
                const urlObj = new URL(targetUrl);
                urlObj.searchParams.delete('dl');
                urlObj.searchParams.set('raw', '1'); // Force raw stream
                targetUrl = urlObj.toString();
                console.log(`[${requestId}] 💧 Dropbox Optimized URL: ${targetUrl}`);
            } catch (e) {
                console.error(`[${requestId}] ❌ URL Parsing Error:`, e);
            }
        }

        const headers = {};
        if (req.headers.range) {
            headers['Range'] = req.headers.range;
            console.log(`[${requestId}] 📏 Range Request: ${req.headers.range}`);
        }

        console.log(`[${requestId}] 🚀 Fetching upstream...`);
        const response = await fetch(targetUrl, { headers });
        console.log(`[${requestId}] ⬅️ Upstream Response: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errText = await response.text().catch(() => 'No text');
            console.error(`[${requestId}] ❌ Upstream Error Body: ${errText}`);
            throw new Error(`External Link Error: ${response.status} ${response.statusText}`);
        }

        // Forward headers
        res.status(response.status);
        const headersToForward = ['content-type', 'content-length', 'content-range', 'accept-ranges'];
        headersToForward.forEach(h => {
            const val = response.headers.get(h);
            if (val) {
                res.setHeader(h, val);
                console.log(`[${requestId}] ➡️ Forwarding Header: ${h}: ${val}`);
            }
        });

        // Force Video Content-Type
        const ct = response.headers.get('content-type');
        console.log(`[${requestId}] ℹ️ Original Content-Type: ${ct}`);
        
        if (!ct || ct === 'application/octet-stream' || ct === 'text/plain') {
            res.setHeader('Content-Type', 'video/mp4');
            console.log(`[${requestId}] 🔧 Forcing Content-Type: video/mp4`);
        }

        // Pipe the stream
        if (response.body && typeof response.body.pipe === 'function') {
            response.body.pipe(res);
            response.body.on('error', (err) => console.error(`[${requestId}] ❌ Stream Error:`, err));
            res.on('finish', () => console.log(`[${requestId}] ✅ Stream Finished`));
        } else {
             console.log(`[${requestId}] ⚠️ Response body is not a stream (node-fetch v3?), converting...`);
             // For node-fetch v3 or native fetch which returns web stream
             const reader = response.body.getReader();
             const stream = new Readable({
                async read() {
                    const { done, value } = await reader.read();
                    if (done) {
                        this.push(null);
                    } else {
                        this.push(Buffer.from(value));
                    }
                }
             });
             stream.pipe(res);
        }
        return;
    }

    // 🔥 BACKBLAZE STREAMING
    if (provider === 'backblaze') {
        const s3 = getS3Client();
        const bucketName = process.env.B2_BUCKET_NAME;
        
        console.log(`📡 Stream Request for Backblaze File: ${fileId} in bucket ${bucketName}`);

        const commandInput = {
            Bucket: bucketName,
            Key: fileId,
        };

        if (req.headers.range) {
            commandInput.Range = req.headers.range;
            console.log(`   Range: ${req.headers.range}`);
        }

        const command = new GetObjectCommand(commandInput);

        try {
            const response = await s3.send(command);
            
            // Forward headers
            res.status(response.$metadata.httpStatusCode || 200);
            
            // Set CORS/CORP headers explicitly for video playback
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

            if (response.ContentLength) res.setHeader('Content-Length', response.ContentLength);
            if (response.ContentType) res.setHeader('Content-Type', response.ContentType);
            if (response.ContentRange) res.setHeader('Content-Range', response.ContentRange);
            if (response.AcceptRanges) res.setHeader('Accept-Ranges', response.AcceptRanges);
            
            // Pipe stream
            response.Body.pipe(res);
            
        } catch (s3Err) {
            console.error('❌ Backblaze S3 Error:', s3Err);
            
            // Gestion spécifique des erreurs de quota Backblaze
            if (s3Err.Code === 'AccessDenied' && (s3Err.message?.includes('cap exceeded') || s3Err.toString().includes('cap exceeded'))) {
                return res.status(503).json({ 
                    error: 'Limite de bande passante Backblaze dépassée. Veuillez patienter ou mettre à niveau le compte de stockage.',
                    details: s3Err.message 
                });
            }

            if (s3Err.name === 'NoSuchKey') {
                return res.status(404).json({ error: 'Fichier vidéo introuvable dans le bucket Backblaze' });
            }
            
            // Erreur générique
            return res.status(500).json({ error: 'Erreur lors du streaming depuis Backblaze', details: s3Err.message });
        }
        return;
    }

    // 📦 DROPBOX STREAMING (Legacy support if token exists)
    if (provider === 'dropbox' && process.env.DROPBOX_ACCESS_TOKEN) {
       // ... existing dropbox logic ...
       // (Removed for brevity as per user request to remove dropbox, but let's keep it minimal for legacy/fallback if user has old links)
       // Actually user said "supprime dropbox", so I will remove the logic block entirely or just error out.
       // I'll leave the block in the 'Universal Relay' for external URLs, but remove the API based one to clean up.
       throw new Error('Dropbox provider is deprecated. Please re-upload to Backblaze.');
    }

    // ☁️ GOOGLE DRIVE STREAMING
    const drive = getDriveClient()
    
    // 1. Get metadata (size, mime)
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'size, mimeType'
    })
    
    const fileSize = parseInt(file.data.size)
    const range = req.headers.range
    
    if (range) {
      // Range request (standard for video streaming)
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': file.data.mimeType,
      }
      
      res.writeHead(206, head)
      
      const response = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream', headers: { Range: `bytes=${start}-${end}` } }
      )
      
      response.data
        .on('end', () => {})
        .on('error', err => console.error('Stream error', err))
        .pipe(res)
        
    } else {
      // Full request
      const head = {
        'Content-Length': fileSize,
        'Content-Type': file.data.mimeType,
      }
      res.writeHead(200, head)
      
      const response = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
      )
      
      response.data
        .on('error', err => console.error('Stream full error', err))
        .pipe(res)
    }
    
  } catch (err) {
    console.error('Proxy Stream Error:', err)
    if (!res.headersSent) {
       res.status(500).json({ error: err.message })
    }
  }
}


