const express = require('express');
const router = express.Router();
const MiddelWares = require('../middleware/casosMiddleWare');

router.post('/CrearCaso', MiddelWares.CrearCaso); // crea un caso nuevo
router.post('/eliminaCaso', MiddelWares.eliminaCaso); //  Eliminar un caso existente
router.post('/obtieneCaso', MiddelWares.obtieneCaso); //  Obtener caso especifico
router.post('/obtieneCasosPorClienteYAbogado', MiddelWares.obtieneCasosPorClienteYAbogado); // obtiene un caso por cliente y abogado
router.post('/actualizaEstadoCaso', MiddelWares.actualizaEstadoCaso); // Actualizar el caso
router.post('/api/obtieneCasosPorCliente', MiddelWares.obtieneCasosPorCliente); // Obtener casos por cliente

module.exports = router;
