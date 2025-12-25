
const DB_NAME = 'QuickPopOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveOfflineVideo = async (video, onProgress) => {
  try {
    // 1. Fetch the video file with progress tracking
    const response = await fetch(video.video_url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const contentType = response.headers.get('Content-Type') || 'video/mp4';

    let blob;
    const contentLength = response.headers.get('Content-Length');

    if (!contentLength || !response.body) {
       const rawBlob = await response.blob();
       blob = rawBlob.type ? rawBlob : new Blob([rawBlob], { type: contentType });
       if (onProgress) onProgress(100);
    } else {
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        if (onProgress) {
          onProgress((loaded / total) * 100);
        }
      }
      blob = new Blob(chunks, { type: contentType });
    }

    // 2. Fetch thumbnail if available
    let thumbnailBlob = null;
    if (video.thumbnail_url) {
      try {
        const thumbResponse = await fetch(video.thumbnail_url);
        if (thumbResponse.ok) {
          thumbnailBlob = await thumbResponse.blob();
        }
      } catch (e) {
        console.warn('Failed to download thumbnail', e);
      }
    }

    // 3. Open DB
    const db = await openDB();

    // 4. Store data
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const offlineData = {
        ...video,
        blob: blob,
        thumbnailBlob: thumbnailBlob,
        downloadedAt: new Date().toISOString(),
        size: blob.size
      };

      const request = store.put(offlineData);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject('Error saving video');
    });
  } catch (error) {
    console.error('Error in saveOfflineVideo:', error);
    throw error;
  }
};

export const getOfflineVideo = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error fetching video');
  });
};

export const getOfflineVideos = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error fetching videos');
  });
};

export const removeOfflineVideo = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject('Error deleting video');
  });
};

export const isVideoOffline = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject('Error checking video status');
  });
};
