const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const resultObj = require('../models/GenericResponse');
const casosController = require('../controllers/casosController'); 
const userController = require('../controllers/userController'); 
const documentsController = require('../controllers/documentsController'); 



  
async function eliminarDocumento (req, res) {
    const { token, idDocumento } = req.body;
    const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
  
    try {
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        const eliminarResult = await documentsController.eliminarDocumento(idDocumento);
        result.Code = 0;
        result.Description = eliminarResult;
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
};
  
async function obtenerDocumentosPorCliente (req, res) {
    const { token, idCliente } = req.body;
    const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
  
    try {
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        const documentos = await documentsController.obtenerDocumentosPorCliente(idCliente);
        result.Code = 0;
        result.Description = 'Documentos obtenidos correctamente';
        result.IsSuccessful = true;
        result.Details = documentos;
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
};
  
async function obtenerDocumentosPorCaso (req, res) {
    const { token, idCaso } = req.body;
    const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
  
    try {
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        const documentos = await documentsController.obtenerDocumentosPorCaso(idCaso);
        result.Code = 0;
        result.Description = 'Documentos obtenidos correctamente';
        result.IsSuccessful = true;
        result.Details = documentos;
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
};
  
async function descargarDocumento (req, res) {
    const { token, idDocumento } = req.body;
    const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
  
    try {
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        const { filePath, nombreDocumento } = await documentsController.descargarDocumento(idDocumento);
        console.log('Sending file:', filePath, 'as', nombreDocumento);
  
        const absoluteFilePath = path.resolve(filePath); 
  
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
        res.download(absoluteFilePath, path.basename(filePath), (err) => {
          if (err) {
            console.error('Error in res.download:', err);
            result.Code = -1;
            result.Description = 'Error al descargar el documento';
            result.IsSuccessful = false;
            result.Details = err.message;
            res.json(result);
          }
        });
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        res.json(result);
      }
    } catch (error) {
      console.error('Error in descargarDocumento endpoint:', error);
      result.Code = -1;
      result.Description = error.message;
      result.IsSuccessful = false;
      res.json(result);
    }
};

  module.exports = {
    eliminarDocumento,
    obtenerDocumentosPorCliente,
    obtenerDocumentosPorCaso,
    descargarDocumento
};