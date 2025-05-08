const express = require('express');
const {
  crearHorarioMiddleware,
  obtenerHorariosMiddleware,
  crearCitaMiddleware,
  obtenerCitaMiddleware,
  cancelarCitaMiddleware,
  cancelarHorarioMiddleware,
  getCitasProximosDiasMiddleware,
  obtenerCitasClienteMiddleware,
} = require('../middleware/citasMiddleWare');

module.exports = (client) => {
  const router = express.Router();

  router.post('/crearHorario', crearHorarioMiddleware);
  router.post('/getCitasProximosDias', getCitasProximosDiasMiddleware);
  router.get('/horarios/:fecha', obtenerHorariosMiddleware);
  router.post('/crearCita', (req, res) => crearCitaMiddleware(client, req, res));
  router.get('/citas/:idHorario', obtenerCitaMiddleware);
  router.post('/cancelarCita', (req, rest) => cancelarCitaMiddleware(client, req,rest));
  router.post('/cancelarHorario', cancelarHorarioMiddleware);
  router.post('/obtenerCitasCliente', obtenerCitasClienteMiddleware);

  return router;
};
