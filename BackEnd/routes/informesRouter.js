const express = require('express');
const router = express.Router();
const MiddelWares = require('../middleware/informesMiddleware');

router.get('/accesos-usuarios', MiddelWares.obtenerInformeAccesos); 
router.post('/numeros-seguridad', MiddelWares.agregarNumeroSeguridadMiddleware); 
router.put('/numeros-seguridad/:numeroSeguridadId', MiddelWares.actualizarNumeroSeguridad); 
router.delete('/numeros-seguridad/:numeroSeguridadId', MiddelWares.eliminarNumeroSeguridadMiddleware);
router.get('/modificaciones-casos', MiddelWares.obtenerRegistroModificaciones); 
router.get('/citas-agendadas', MiddelWares.obtenerInformeCitas); 
router.get('/informe-casos', MiddelWares.obtenerInformeCasos); 
router.get('/numeros-seguridad', MiddelWares.obtenerNumerosSeguridadMiddleware);
module.exports = router;
