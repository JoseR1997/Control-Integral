const express = require('express');
const router = express.Router();
const MiddelWares = require('../middleware/documentosMiddleware');

router.post('/eliminarDocumento', MiddelWares.eliminarDocumento); // Eliminar un documento
router.post('/obtenerDocumentosPorCliente', MiddelWares.obtenerDocumentosPorCliente); //  obtiene documentos por cliente
router.post('/obtenerDocumentosPorCaso', MiddelWares.obtenerDocumentosPorCaso); // obtiene documentos por caso
router.post('/descargarDocumento', MiddelWares.descargarDocumento); // Descargar los documentos

module.exports = router;
