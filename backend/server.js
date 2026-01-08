import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import db, { testDBConnection } from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import videosRoutes from './routes/videosRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import likesRoutes from './routes/likesRoutes.js';
import playlistsRoutes from './routes/playlistsRoutes.js';
import playlistVideosRoutes from './routes/playlistVideosRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import certificationsRoutes from './routes/certificationsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import appSettingsRoutes from './routes/appSettingsRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import { ensureUsersTable } from './models/usersModel.js';
import { ensureNotificationsTable } from './models/notificationsModel.js';
import { ensureVideosTable } from './models/videosModel.js';
import { ensureCategoriesTable } from './models/categoriesModel.js';
import { ensureCommentsTable } from './models/commentsModel.js';
import { ensureLikesTable } from './models/likesModel.js';
import { ensurePlaylistsTable } from './models/playlistsModel.js';
import { ensurePlaylistVideosTable } from './models/playlistVideosModel.js';
import { ensureSupportTable } from './models/supportModel.js';
import { ensureAppSettingsTable } from './models/appSettingsModel.js';
import { ensureTrainingsTables } from './models/trainingsModel.js';
import { ensureCertificationsTables } from './models/certificationsModel.js';
import { ensureRatingsTable } from './models/ratingsModel.js';

// Charger les variables d'environnement avant tout
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: IS_PRODUCTION 
      ? ['https://quick-pop.web.app'] 
      : '*', 
    methods: ["GET", "POST"]
  }
});

// Attach io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Track online users: userId -> Set<socketId>
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);

    // Track online status based on user room "user_{id}"
    if (room.startsWith('user_')) {
      const userId = parseInt(room.split('_')[1]);
      if (!isNaN(userId)) {
        socket.userId = userId;
        
        if (!userSockets.has(userId)) {
          userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);
        
        // Broadcast online users list to all clients
        io.emit('online_users', Array.from(userSockets.keys()));
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    if (socket.userId) {
      const userSocketSet = userSockets.get(socket.userId);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);
        if (userSocketSet.size === 0) {
          userSockets.delete(socket.userId);
        }
        // Broadcast updated list
        io.emit('online_users', Array.from(userSockets.keys()));
      }
    }
  });
});

// ========================================
// MIDDLEWARES DE SÉCURITÉ
// ========================================

// 1. Helmet - Protection des headers HTTP
app.use(helmet({
  contentSecurityPolicy: IS_PRODUCTION,
  crossOriginResourcePolicy: false, // Désactiver CORP pour permettre le chargement de vidéos cross-origin
  hsts: IS_PRODUCTION ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false
}));

// 2. CORS - Configuration (souple en développement, stricte en production)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean)
  : IS_PRODUCTION 
    ? ['https://votredomaine.com']
    : ['http://localhost:3005', 'http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (ex: curl, mobile apps, outils backend)
    if (!origin) return callback(null, true);

    if (!IS_PRODUCTION) {
      // Dev: autoriser toutes les origines (navigateurs sur le LAN, localhost, IP)
      return callback(null, true)
    }

    // Production : Vérification stricte
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true)
    }
    
    console.error(`🔴 CORS Bloqué: ${origin}`);
    return callback(new Error(`CORS: Origin ${origin} non autorisée`))
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'X-Requested-With']
};
app.use(cors(corsOptions));

// 3. Rate Limiting - Protection contre les attaques DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: IS_PRODUCTION ? 100 : 500, // limite de requêtes
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Exempter certaines IP en développement si nécessaire
    return !IS_PRODUCTION && req.ip === '::1';
  }
});
app.use(limiter);

// Rate limiting plus strict pour les endpoints sensibles
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 20 : 100,
  message: { error: 'Trop de tentatives, compte temporairement bloqué.' }
});

// 4. Body parser avec limite de taille
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'JSON invalide' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Protection contre les injections NoSQL (fonctionne aussi pour SQL)
const sanitizeInPlace = (obj) => {
  if (!obj || typeof obj !== 'object') return
  const keys = Object.keys(obj)
  for (const key of keys) {
    const val = obj[key]
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key]
      continue
    }
    if (val && typeof val === 'object') {
      sanitizeInPlace(val)
    }
  }
}
app.use((req, res, next) => {
  try {
    sanitizeInPlace(req.query)
    sanitizeInPlace(req.params)
    sanitizeInPlace(req.body)
    next()
  } catch (e) {
    next(e)
  }
})

// 6. Protection contre HTTP Parameter Pollution
app.use(hpp());

// 7. Désactiver l'en-tête X-Powered-By
app.disable('x-powered-by');

// 8. Logging des requêtes en production
if (IS_PRODUCTION) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
    });
    next();
  });
}

// 9. Middleware de validation des entrées
const validateInput = (req, res, next) => {
  // Vérifier les tentatives d'injection SQL basiques
  const suspiciousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(--|\;|\/\*|\*\/|xp_|sp_)/gi,
    /('|")(.*)(OR|AND)(.*)(=|LIKE)/gi
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => checkValue(v));
    }
    return false;
  };

  const suspicious = checkValue(req.body) || checkValue(req.query) || checkValue(req.params);
  
  if (suspicious) {
    console.error('🚨 Tentative d\'injection SQL détectée:', {
      ip: req.ip,
      path: req.path,
      body: req.body,
      query: req.query
    });
    return res.status(400).json({ error: 'Requête invalide détectée' });
  }
  
  next();
};

app.use(validateInput);

// ========================================
// ROUTES
// ========================================

app.use('/api/users', strictLimiter, usersRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/auth', strictLimiter, authRoutes);
app.use('/api/account', strictLimiter, accountRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/playlist-videos', playlistVideosRoutes);
app.use('/api/support', strictLimiter, supportRoutes);
app.use('/api/app-settings', appSettingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Legacy/Fallback routes (without /api prefix) for backward compatibility
app.use('/users', strictLimiter, usersRoutes);
app.use('/certifications', certificationsRoutes);
app.use('/auth', strictLimiter, authRoutes);
app.use('/account', strictLimiter, accountRoutes);
app.use('/categories', categoriesRoutes);
app.use('/videos', videosRoutes);
app.use('/likes', likesRoutes);
app.use('/comments', commentsRoutes);
app.use('/playlists', playlistsRoutes);
app.use('/playlist-videos', playlistVideosRoutes);
app.use('/support', strictLimiter, supportRoutes);
app.use('/app-settings', appSettingsRoutes);
app.use('/search', searchRoutes);
app.use('/reports', reportsRoutes);
app.use('/notifications', notificationsRoutes);

// Route de santé (sans rate limit)
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 QuickPop API is running",
    status: "healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Health check pour monitoring
app.get("/health", async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ 
      status: "healthy", 
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: "unhealthy", 
      database: "disconnected",
      error: IS_PRODUCTION ? undefined : error.message 
    });
  }
});

// Meta: lister les tables (SÉCURISÉ et restreint)
app.get('/meta/tables', async (req, res) => {
  try {
    // Vérifier l'authentification (à adapter selon votre système)
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !verifyAdminToken(authHeader)) {
    //   return res.status(403).json({ error: 'Accès non autorisé' });
    // }

    // En production, désactiver complètement cette route
    if (IS_PRODUCTION && process.env.DISABLE_META_ROUTES === 'true') {
      return res.status(404).json({ error: 'Route non trouvée' });
    }

    const schema = process.env.DB_NAME;
    
    if (!schema) {
      throw new Error('DB_NAME non configuré');
    }

    // Utiliser des requêtes préparées
    const [rows] = await db.query(
      'SELECT TABLE_NAME AS table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
      [schema]
    );
    
    return res.json({ 
      source: 'mysql', 
      tables: rows.map(r => r.table_name),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erreur /meta/tables:', err);
    res.status(500).json({ 
      error: IS_PRODUCTION ? 'Erreur serveur' : err.message 
    });
  }
});

// ========================================
// GESTION DES ERREURS
// ========================================

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path 
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('💥 Erreur non gérée:', err);
  
  // Ne pas exposer les détails en production
  const errorResponse = {
    error: IS_PRODUCTION ? 'Une erreur est survenue' : err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  };

  if (!IS_PRODUCTION) {
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// ========================================
// GESTION DES PROCESSUS
// ========================================

// Gérer les erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('💥 Exception non capturée:', err);
  if (IS_PRODUCTION) {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promesse rejetée non gérée:', reason);
  if (IS_PRODUCTION) {
    process.exit(1);
  }
});

// Arrêt gracieux
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Signal ${signal} reçu, arrêt gracieux...`);
  
  // Fermer le serveur
  if (httpServer.listening) {
      httpServer.close(async () => {
        console.log('✅ Serveur HTTP fermé');
        
        // Fermer la connexion DB
        try {
          await db.end();
          console.log('✅ Connexion DB fermée');
          process.exit(0);
        } catch (err) {
          console.error('❌ Erreur fermeture DB:', err);
          process.exit(1);
        }
      });
  } else {
      process.exit(0);
  }

  // Forcer l'arrêt après 10 secondes
  setTimeout(() => {
    console.error('⚠️ Arrêt forcé');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ========================================
// LANCEMENT DU SERVEUR
// ========================================

const startServer = async () => {
    try {
        await testDBConnection();
        console.log('✅ Base de données connectée\n');

        // Initialisation séquentielle des tables
        await ensureUsersTable();
        await ensureCategoriesTable();
        await ensureVideosTable();
        await ensureCommentsTable();
        await ensureLikesTable();
        await ensurePlaylistsTable();
        await ensurePlaylistVideosTable();
        await ensureNotificationsTable();
        await ensureSupportTable();
        await ensureAppSettingsTable();
        await ensureTrainingsTables();
        await ensureCertificationsTables();
        await ensureRatingsTable();

        console.log('✅ Tables vérifiées (users, notifications, etc.)');
    } catch (err) {
        console.error('❌ Erreur connexion DB:', err.message);
        // Ne pas quitter en Vercel, laisser la requête échouer proprement si besoin
        if (IS_PRODUCTION && !process.env.VERCEL) {
             process.exit(1);
        }
    }
};

// En environnement Vercel, on n'écoute pas sur le port, on exporte juste l'app
// Vercel gère le cycle de vie
if (process.env.VERCEL) {
    // Initialisation DB asynchrone sans bloquer l'export
    startServer();
} else {
    // En local ou VPS classique
    httpServer.listen(PORT, '0.0.0.0', async () => {
      console.log(`
    ╔═══════════════════════════════════════╗
    ║   🚀 QuickPop API                     ║
    ║   📍 http://localhost:${PORT}           ║
    ║   🌍 Environnement: ${NODE_ENV.padEnd(14)} ║
    ╚═══════════════════════════════════════╝
      `);
      
      await startServer();
    });
}

export default app;
