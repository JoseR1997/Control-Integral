const express = require('express');
const router = express.Router();
const MiddleWares = require('../middleware/serviciosMiddleWare');

router.post('/guardarServicio', MiddleWares.guardarServicio); 
router.post('/obtenerServicios', MiddleWares.obtenerServicios); 
router.post('/eliminarServicio', MiddleWares.eliminarServicio); 
router.post('/actualizarServicio', MiddleWares.actualizarServicio); 

module.exports = router;