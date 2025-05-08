const express = require('express');
const cors = require('cors');
const resultObj = require('../models/GenericResponse');
const informesController = require('../controllers/informesController');
const userController = require('../controllers/userController')

async function obtenerInformeAccesos(req, res) {
  const result = { ...resultObj };
  try {
    const accesos = await informesController.obtenerInformeAccesos();
    result.Code = 0;
    result.Description = 'Accesos de usuarios obtenidos exitosamente';
    result.Issuccessful = true;
    result.Details = accesos;
    res.status(200).json(result);
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.Issuccessful = false;
    result.Details = null;
    res.status(500).json(result);
  }
}

async function obtenerNumerosSeguridadMiddleware(req, res) {
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const validaSesion = await userController.validarTokenDeSesion(token);

    if (validaSesion) {
      const numerosSeguridad = await informesController.obtenerNumerosSeguridad();
      result.Code = 0;
      result.Description = 'Números de seguridad obtenidos exitosamente';
      result.IsSuccessful = true;
      result.Details = numerosSeguridad;
      res.status(200).json(result);
    } else {
      result.Code = -1;
      result.Description = 'Sesión inválida, ingrese de nuevo';
      result.IsSuccessful = false;
      result.Details = null;
      res.status(401).json(result);
    }
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.status(500).json(result);
  }
}

async function agregarNumeroSeguridadMiddleware(req, res) {
  const { token, idRol, idUsuario, numeroSeguridad, codigoBoleta, tipo } = req.body;
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  try {
    if (idRol === 1) { 
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        const numeroSeguridadId = await informesController.agregarNumeroSeguridad({ idUsuario, numeroSeguridad, codigoBoleta, tipo });
        result.Code = 0;
        result.Description = 'Número de seguridad añadido exitosamente';
        result.IsSuccessful = true;
        result.Details = { numeroSeguridadId };
        res.status(201).json(result);
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        result.Details = null;
        res.status(401).json(result);
      }
    } else {
      result.Code = -1;
      result.Description = 'No cuenta con permisos suficientes';
      result.IsSuccessful = false;
      result.Details = null;
      res.status(403).json(result);
    }
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.status(500).json(result);
  }
}

async function actualizarNumeroSeguridad(req, res) {
  const result = { ...resultObj };
  try {
    await informesController.actualizarNumeroSeguridad(req.params.numeroSeguridadId, req.body);
    result.Code = 0;
    result.Description = 'Número de seguridad actualizado exitosamente';
    result.Issuccessful = true;
    result.Details = null;
    res.status(200).json(result);
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.Issuccessful = false;
    result.Details = null;
    res.status(400).json(result);
  }
}

async function eliminarNumeroSeguridadMiddleware(req, res) {
  const { token, idRol } = req.body;
  const { numeroSeguridadId } = req.params;
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  try {
    if (idRol === 1) { 
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        await informesController.eliminarNumeroSeguridad(numeroSeguridadId);
        result.Code = 0;
        result.Description = 'Número de seguridad eliminado exitosamente';
        result.IsSuccessful = true;
        result.Details = null;
        res.status(200).json(result);
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        result.Details = null;
        res.status(401).json(result);
      }
    } else {
      result.Code = -1;
      result.Description = 'No cuenta con permisos suficientes';
      result.IsSuccessful = false;
      result.Details = null;
      res.status(403).json(result);
    }
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.status(400).json(result);
  }
}

async function obtenerRegistroModificaciones(req, res) {
  const result = { ...resultObj };
  try {
    const modificaciones = await informesController.obtenerRegistroModificaciones();
    result.Code = 0;
    result.Description = 'Modificaciones de casos obtenidas exitosamente';
    result.Issuccessful = true;
    result.Details = modificaciones;
    res.status(200).json(result);
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.Issuccessful = false;
    result.Details = null;
    res.status(500).json(result);
  }
}

async function obtenerInformeCitas(req, res) {
  const result = { ...resultObj };
  try {
    const citas = await informesController.obtenerInformeCitas();
    result.Code = 0;
    result.Description = 'Citas agendadas obtenidas exitosamente';
    result.Issuccessful = true;
    result.Details = citas;
    res.status(200).json(result);
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.Issuccessful = false;
    result.Details = null;
    res.status(500).json(result);
  }
}

async function obtenerInformeCasos(req, res) {
  const result = { ...resultObj };
  try {
    const informeCasos = await informesController.obtenerInformeCasos();
    result.Code = 0;
    result.Description = 'Informe de casos obtenido exitosamente';
    result.Issuccessful = true;
    result.Details = informeCasos;
    res.status(200).json(result);
  } catch (err) {
    result.Code = 99;
    result.Description = err.message;
    result.Issuccessful = false;
    result.Details = null;
    res.status(500).json(result);
  }
}


module.exports = {
  obtenerNumerosSeguridadMiddleware,
  obtenerInformeAccesos,
  agregarNumeroSeguridadMiddleware,
  actualizarNumeroSeguridad,
  eliminarNumeroSeguridadMiddleware,
  obtenerRegistroModificaciones,
  obtenerInformeCitas,
  obtenerInformeCasos
};
