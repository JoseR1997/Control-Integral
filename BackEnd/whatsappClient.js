const wppconnect = require('@wppconnect-team/wppconnect');
const fs = require('fs').promises;
const path = require('path');

let client = null;
let isInitializing = false;
const MAX_RETRIES = 3;
let retryCount = 0;

async function cleanSession() {
  const sessionPath = path.join(__dirname, 'tokens', 'sessionName');
  try {
    await fs.rm(sessionPath, { recursive: true, force: true });
    console.log('Sesión anterior limpiada');
  } catch (error) {
    console.error('Error al limpiar la sesión:', error);
  }
}

async function initializeClient(io) {
  if (isInitializing) {
    console.log('Ya se está inicializando una conexión');
    return { success: false, message: 'Inicialización en progreso' };
  }
  isInitializing = true;

  try {
    if (client) {
      await client.close();
      client = null;
    }

    client = await wppconnect.create({
      session: 'sessionName',
      catchQR: (qrCode, asciiQR) => {
        console.log('QR Code ASCII:\n', asciiQR);
        io.emit('qr', qrCode);
      },
      statusFind: (statusSession, session) => {
        console.log('Status Session:', statusSession);
        console.log('Session name: ', session);
        io.emit('whatsapp-status', statusSession);
      },
      headless: false,
      qrTimeout: 60000,
      authTimeout: 60000,
      puppeteerOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu'],
      },
      logQR: true
    });

    client.onStateChange((state) => {
      console.log('Estado del cliente:', state);
      if (state === 'DISCONNECTED') {
        console.log('Cliente desconectado');
        io.emit('whatsapp-status', 'disconnected');
        client = null;
      }
    });

    await client.waitForLogin();
    console.log('Cliente inicializado y conectado con éxito');
    retryCount = 0;
    return { success: true, message: 'Cliente inicializado con éxito' };
  } catch (error) {
    console.error('Error al inicializar el cliente:', error);
    return { success: false, message: 'Error al inicializar el cliente' };
  } finally {
    isInitializing = false;
  }
}

async function reconnectClient(io) {
  if (retryCount >= MAX_RETRIES) {
    console.log('Número máximo de intentos de reconexión alcanzado');
    retryCount = 0;
    return { success: false, message: 'Máximo de intentos de reconexión alcanzado' };
  }
  retryCount++;
  console.log(`Intento de reconexión ${retryCount}/${MAX_RETRIES}`);

  try {
    const result = await initializeClient(io);
    if (result.success) {
      console.log('Reconexión exitosa');
      return result;
    } else {
      console.log('Fallo en la reconexión, reintentando...');
      return await reconnectClient(io);
    }
  } catch (error) {
    console.error('Error durante la reconexión:', error);
    return { success: false, message: 'Error durante la reconexión' };
  }
}

function getClient() {
  return client;
}

async function disconnectClient() {
  if (client && (await client.isConnected())) {
    try {
      await client.logout();
      client = null;
      return true;
    } catch (error) {
      console.error('Error al desconectar:', error);
      return false;
    }
  }
  return true; 
}

const sendMessage = async (number, message) => {
  const chatId = `${number}@c.us`;
  try {
    await client.sendText(chatId, message);
    console.log('Mensaje enviado con éxito a', number);
  } catch (err) {
    console.error('Error al enviar el mensaje', err);
  }
};

module.exports = { 
  initializeClient, 
  getClient, 
  reconnectClient, 
  disconnectClient, 
  sendMessage 
};
