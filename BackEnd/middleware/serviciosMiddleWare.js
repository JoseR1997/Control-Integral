const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const resultObj = require('../models/GenericResponse');
const serviciosController = require('../controllers/serviciosController'); 
const userController = require('../controllers/userController'); 

async function guardarServicio(req, res) {
      const { token, nombreServicio, descripcion, precioBase } = req.body;
      const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
  
      try {
          const validaSesion = await userController.validarTokenDeSesion(token);
          if (validaSesion) {
              const guardarResult = await serviciosController.guardarServicio(nombreServicio, descripcion, precioBase);
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
  }

async function eliminarServicio (req, res) {
      const { token, idServicio } = req.body;
      const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
    
      try {
        const validaSesion = await userController.validarTokenDeSesion(token);
        if (validaSesion) {
          const eliminarResult = await serviciosController.eliminarServicio(idServicio);
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

  async function obtenerServicios(req, res) {
      const { token } = req.body;
      const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
  
      try {
          const validaSesion = await userController.validarTokenDeSesion(token);
          if (validaSesion) {
              const documentos = await serviciosController.obtenerServicios();
              result.Code = 0;
              result.Description = 'Servicios obtenidos correctamente';
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
  }

  async function actualizarServicio(req, res) {
      const { token, idServicio, nombreServicio, descripcion, precioBase } = req.body;
      const result = { Code: null, Description: '', IsSuccessful: false, Details: null };
    
      try {
         
          const validaSesion = await userController.validarTokenDeSesion(token);
          if (validaSesion) {
              
              const actualizarResult = await serviciosController.actualizarServicio(idServicio, nombreServicio, descripcion, precioBase);
              result.Code = 0;
              result.Description = actualizarResult;
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

  module.exports = {
      guardarServicio,
      eliminarServicio,
      obtenerServicios,
      actualizarServicio
  };