const express = require('express');
const router = express.Router();
const { getClient, reconnectClient, disconnectClient } = require('../whatsappClient');

function whatsappRouter(io) {
  router.get('/whatsapp-status', (req, res) => {
    const client = getClient();
    const status = client && client.isConnected() ? 'connected' : 'disconnected';
    res.json({ status, connected: status === 'connected' });
  });

  router.post('/whatsapp-connect', async (req, res) => {
    try {
      const result = await reconnectClient(io);
      if (result.success) {
        res.json({ success: true, message: 'Proceso de conexión iniciado, escanea el QR si es necesario' });
      } else {
        res.status(503).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error al conectar WhatsApp:', error);
      res.status(500).json({ success: false, message: 'Error al conectar', error: error.message });
    }
  });

  router.post('/whatsapp-disconnect', async (req, res) => {
    try {
      const success = await disconnectClient();
      if (success) {
        io.emit('whatsapp-status', 'disconnected');
        res.json({ success: true, message: 'Desconectado exitosamente' });
      } else {
        res.status(500).json({ success: false, message: 'Error al desconectar' });
      }
    } catch (error) {
      console.error('Error al desconectar WhatsApp:', error);
      res.status(500).json({ success: false, message: 'Error al desconectar', error: error.message });
    }
  });

  return router;
}

module.exports = whatsappRouter;