import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Estatísticas do dashboard
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Total de revendas
    const [totalRevendas] = await pool.execute(
      'SELECT COUNT(*) as total FROM revendas'
    );

    // Revendas por status
    const [revendasPorStatus] = await pool.execute(
      `SELECT 
        status_detalhado,
        COUNT(*) as total
       FROM revendas 
       GROUP BY status_detalhado`
    );

    // Total de streamings
    const [totalStreamings] = await pool.execute(
      'SELECT COUNT(*) as total FROM streamings'
    );

    // Streamings por status
    const [streamingsPorStatus] = await pool.execute(
      `SELECT 
        status,
        COUNT(*) as total
       FROM streamings 
       GROUP BY status`
    );

    // Somar recursos
    const [recursos] = await pool.execute(
      `SELECT 
        SUM(streamings) as totalStreamings,
        SUM(espectadores) as totalEspectadores,
        SUM(espaco_usado_mb) as espacoUsado,
        SUM(bitrate) as totalBitrate
       FROM revendas`
    );

    // Recursos de streamings
    const [recursosStreamings] = await pool.execute(
      `SELECT 
        SUM(espectadores) as totalEspectadoresStreamings,
        SUM(espaco_usado) as espacoUsadoStreamings,
        SUM(bitrate) as totalBitrateStreamings,
        SUM(espectadores_conectados) as espectadoresConectados
       FROM streamings`
    );

    // Organizar dados por status
    const statusData = {
      revendasAtivas: 0,
      revendasSuspensas: 0,
      revendasExpiradas: 0,
      revendasCanceladas: 0,
      revendasTeste: 0
    };

    revendasPorStatus.forEach(item => {
      switch (item.status_detalhado) {
        case 'ativo':
          statusData.revendasAtivas = item.total;
          break;
        case 'suspenso':
          statusData.revendasSuspensas = item.total;
          break;
        case 'expirado':
          statusData.revendasExpiradas = item.total;
          break;
        case 'cancelado':
          statusData.revendasCanceladas = item.total;
          break;
        case 'teste':
          statusData.revendasTeste = item.total;
          break;
      }
    });

    // Organizar dados de streamings por status
    const streamingsStatusData = {
      streamingsAtivas: 0,
      streamingsInativas: 0,
      streamingsBloqueadas: 0
    };

    streamingsPorStatus.forEach(item => {
      switch (item.status) {
        case 1:
          streamingsStatusData.streamingsAtivas = item.total;
          break;
        case 0:
          streamingsStatusData.streamingsInativas = item.total;
          break;
        case 2:
          streamingsStatusData.streamingsBloqueadas = item.total;
          break;
      }
    });
    res.json({
      totalRevendas: totalRevendas[0].total,
      ...statusData,
      totalStreamings: totalStreamings[0].total,
      ...streamingsStatusData,
      totalStreamings: recursos[0].totalStreamings || 0,
      totalEspectadores: recursos[0].totalEspectadores || 0,
      espacoUsado: recursos[0].espacoUsado || 0,
      totalBitrate: recursos[0].totalBitrate || 0,
      totalEspectadoresStreamings: recursosStreamings[0].totalEspectadoresStreamings || 0,
      espacoUsadoStreamings: recursosStreamings[0].espacoUsadoStreamings || 0,
      totalBitrateStreamings: recursosStreamings[0].totalBitrateStreamings || 0,
      espectadoresConectados: recursosStreamings[0].espectadoresConectados || 0
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;