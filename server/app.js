import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { settings } from './config/database.js';

import authRoutes from './routes/auth.js';
import revendasRoutes from './routes/revendas.js';
import adminsRoutes from './routes/admins.js';
import logsRoutes from './routes/logs.js';
import dashboardRoutes from './routes/dashboard.js';
import profilesRoutes from './routes/profiles.js';
import serversRoutes from './routes/servers.js';
import configRoutes from './routes/config.js';
import plansRoutes from './routes/plans.js';
import streamingsRoutes from './routes/streamings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http://samhost.wcore.com.br',
      'https://samhost.wcore.com.br',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do build do React no subdiretório /Admin
app.use('/Admin', express.static(path.join(__dirname, '../dist')));

// Servir arquivos públicos (logo, favicon) no subdiretório /Admin
app.use('/Admin', express.static(path.join(__dirname, '../public')));

// Rotas da API com prefixo /Admin/api
app.use('/Admin/api/auth', authRoutes);
app.use('/Admin/api/revendas', revendasRoutes);
app.use('/Admin/api/admins', adminsRoutes);
app.use('/Admin/api/logs', logsRoutes);
app.use('/Admin/api/dashboard', dashboardRoutes);
app.use('/Admin/api/profiles', profilesRoutes);
app.use('/Admin/api/servers', serversRoutes);
app.use('/Admin/api/config', configRoutes);
app.use('/Admin/api/plans', plansRoutes);
app.use('/Admin/api/streamings', streamingsRoutes);

app.get('/Admin/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rota catch-all para o React Router no subdiretório /Admin
app.get('/Admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Se for erro de CORS, retornar resposta específica
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ 
      message: 'Erro de CORS - Origem não permitida',
      error: err.message 
    });
  }
  
  // Se for erro de JSON parsing
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      message: 'Dados JSON inválidos',
      error: 'Formato de dados incorreto' 
    });
  }
  
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

const PORT = settings.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Admin Panel: http://samhost.wcore.com.br/Admin`);
  console.log(`API Health: http://samhost.wcore.com.br/Admin/api/health`);
});

export default app;
