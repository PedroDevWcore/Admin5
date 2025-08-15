import mysql from 'mysql2/promise';

// Todas as configurações fixas aqui:
const settings = {
  NODE_ENV: 'development',
  PORT: 3002,

  DB: {
    HOST: '104.251.209.68',
    PORT: 35689,
    NAME: 'db_SamCast',
    USER: 'admin',
    PASSWORD: 'Adr1an@'
  },

  JWT: {
    SECRET: 'your-super-secret-jwt-key-change-this-in-production',
    EXPIRES_IN: '24h'
  },

  CORS_ORIGIN: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://samhost.wcore.com.br', 
        'https://samhost.wcore.com.br',
        'http://localhost:5173', 
        'http://localhost:3000', 
        'http://127.0.0.1:5173', 
        'http://localhost:5174'
      ]
};

// Configuração do pool de conexões MySQL
const dbConfig = {
  host: settings.DB.HOST,
  port: settings.DB.PORT,
  user: settings.DB.USER,
  password: settings.DB.PASSWORD,
  database: settings.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000 // ✅ válido para mysql2
};

const pool = mysql.createPool(dbConfig);

// Teste de conexão
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
  }
};

testConnection();

// Exporta o pool + as configurações
export {
  pool,
  settings
};
