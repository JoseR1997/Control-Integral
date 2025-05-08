const {
    getCitasDiaMiddleware,
  } = require('../middleware/citasMiddleWare');
  const express = require('express');
  const router = express.Router();

  router.post('/CitasDia', getCitasDiaMiddleware);

  module.exports = router;