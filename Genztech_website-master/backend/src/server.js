require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDb } = require('./db');

const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');
const adminRoutes = require('./routes/admin');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any Vercel preview subdomain when a *.vercel.app entry is configured
    if (allowedOrigins.some(allowed => allowed.includes('*.vercel.app')) && /\.vercel\.app$/.test(new URL(origin).hostname)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'genztech-backend' });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/', authRoutes);
app.use('/', formRoutes);
app.use('/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message && err.message.startsWith('Origin ')) {
    return res.status(403).json({ detail: err.message });
  }
  res.status(500).json({ detail: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 8000;

connectDb(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Genztech backend listening on :${PORT}`));
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
