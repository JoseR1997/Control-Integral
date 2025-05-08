const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const resultObj = require('./models/GenericResponse');
const db = require('./database');
const userController = require('./controllers/userController');
const casosController = require('./controllers/casosController');
const documentsController = require('./controllers/documentsController');
const userRouter = require('./routes/userRouter');
const horarioRouter = require('./routes/horariosRouter');
const CasoRouter = require('./routes/casosRouter');
const serviciosRouter = require('./routes/serviciosRouter');
const informesRouter = require('./routes/informesRouter')
const documentosRouter = require('./routes/documentosRouter');
const initializeCitasRouter = require('./routes/citasRouter');
const createWhatsappRouter = require("./routes/whatsappRouter");
const qrcode = require('qrcode-terminal');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const wppconnect = require('@wppconnect-team/wppconnect');
const upload = multer({ storage: multer.memoryStorage() });
const { initializeClient, getClient } = require('./whatsappClient');

const app = express();
const  port = 5000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());


const initializeRouters = (getClientFunction) => {
  const citasRouter = initializeCitasRouter(getClientFunction);
  app.use('', citasRouter);
  const whatsappRouter = createWhatsappRouter(io, getClientFunction);
  app.use('', whatsappRouter);
};

async function startServer() {
  try {
    const result = await initializeClient(io);
    if (result.success) {
      console.log('WhatsApp client initialized successfully');
      initializeRouters(getClient);
    } else {
      console.error('Failed to initialize WhatsApp client:', result.message);
      // Decide cómo manejar esta situación (reintentar, salir, etc.)
      initializeRouters(() => null);
    }
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    // Manejar el error (reintentar, salir, etc.)
    initializeRouters(() => null);
  }

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}


app.get('/', (req, res) => {
  res.send('Backend is running.');
});

app.use('', userRouter);
app.use('', CasoRouter);
app.use('', documentosRouter);
app.use('', horarioRouter);
app.use('', serviciosRouter);
app.use('/api', informesRouter); 

app.post('/guardarDocumento', upload.single('documento'), async (req, res) => {
  const { token, idCaso, idCliente, nombreDocumento } = req.body;
  const archivo = req.file;
  const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
  try {
    const validaSesion = await userController.validarTokenDeSesion(token);
    if (validaSesion) {
      const guardarResult = await documentsController.guardarDocumento(idCaso, idCliente, nombreDocumento, archivo);
      result.Code = 0;
      result.Description = guardarResult;
      result.IsSuccessful = true;
    } else {
      result.Code = -1;
      result.Description = 'Sesión inválida, ingrese de nuevo';
      result.IsSuccessful = false;
    }
  } catch (error) {
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
  }
  res.json(result);
});

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
  socket.on('get-whatsapp-status', () => {
    const client = getClient();
    const currentStatus = client && client.isConnected() ? 'connected' : 'disconnected';
    socket.emit('whatsapp-status', currentStatus);
  });
});


startServer();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


app.use('', serviciosRouter);
app.use('/api', informesRouter); 