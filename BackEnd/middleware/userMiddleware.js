const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const resultObj = require('../models/GenericResponse');
const userController = require('../controllers/userController'); 

async function Login (req, res)  {
    const { usuario, contrasena } = req.body;
    const result = Object.assign({}, resultObj);
  
    try {
      const consultaUsuario = await userController.consultaUsuario(usuario, contrasena);
      console.log('consultaUsuario result:', consultaUsuario);
  
      if (!consultaUsuario) {
        result.Code = -1;
        result.Description = "Ha ocurrido un error, intente de nuevo";
        result.Issuccessful = false;
        result.Details = null;
      } else {
        const response = userController.generarToken(usuario, consultaUsuario.idRol);
        result.Code = response.token === null ? -1 : 0;
        result.Description = response.token === null ? "Ha ocurrido un error, intente de nuevo" : 'Transacción Exitosa';
        result.Issuccessful = response.token === null ? false : true;
        result.Details = response.token === null ? null : response;
      }
    } catch (error) {
      result.Code = -1;
      result.Description = "Ha ocurrido un error, intente de nuevo";
      result.Issuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};

async function LogOut (req, res)  {
    const { usuario } = req.body;
    const result = Object.assign({}, resultObj);
  
    try {
      const consultaUsuario = userController.LogOut(usuario);
  
      if (consultaUsuario === undefined) {
        result.Code = -1;
        result.Description = "Ha ocurrido un error, intente de nuevo";
        result.Issuccessful = false;
        result.Details = null;
      } else {
        result.Code = 0;
        result.Description = consultaUsuario;
        result.Issuccessful = true;
        result.Details = null;
      }
    } catch (error) {
      result.Code = -1;
      result.Description = "Ha ocurrido un error, intente de nuevo";
      result.Issuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};

async function validaToken (req, res)  {
    const result = Object.assign({}, resultObj);
  
    try {
      const { token } = req.body;
      const response = await userController.validarTokenDeSesion(token);
  
      result.Code = response === undefined ? -1 : 0;
      result.Description = response === undefined ? "Sesión ha finalizado, ingrese nuevamente" : response;
      result.Issuccessful = response === undefined ? false : true;
      const decoded = jwt.verify(token, 'secreto');
      const detailsOBJ = { usuario: response === undefined ? null : decoded.usuario };
      result.Details = detailsOBJ;
  
    } catch (error) {
      result.Code = -1;
      result.Description = "Sesión ha finalizado, ingrese nuevamente";
      result.Issuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};

async function consultaClientes  (req, res)  {
    try {
      const clients = await userController.consultaClientes();
      console.log('Clients fetched:', clients);
      res.status(200).json(clients);
    } catch (err) {
      console.error('Error fetching clients:', err.message);
      res.status(500).json({ error: err.message });
    }
};

async function crearUsuario (req, res)  {
    userController.crearUsuario(req.body, (err, userId) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(201).send(`Usuario creado exitosamente con id: ${userId}`);
      }
    });
};

async function actualizarUsuario (req, res) {
    const idUsuario = req.params.idUsuario;
    userController.actualizarUsuario(idUsuario, req.body, (err) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(200).send('Usuario actualizado exitosamente');
      }
    });
};

async function eliminarUsuario (req, res)  {
    const idUsuario = req.params.idUsuario;
    userController.eliminarUsuario(idUsuario, (err) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(200).send('Usuario eliminado exitosamente');
      }
    });
};

async function obtenerUsuarioPorCorreo (req, res) {
    const { correo } = req.query;
  
    try {
      const usuario = await userController.obtenerUsuarioPorCorreo(correo);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  async function cambiarContrasena (req, res)  {
    const { usuario, contrasenaActual, nuevaContrasena } = req.body;
    const result = Object.assign({}, resultObj);
  
    try {
      const mensaje = await userController.cambiarContrasena(usuario, contrasenaActual, nuevaContrasena);
      result.Code = 0;
      result.Description = mensaje;
      result.Issuccessful = true;
      result.Details = null;
    } catch (error) {
      result.Code = -1;
      result.Description = error.message;
      result.Issuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
  };
  

module.exports = {
    Login,
    LogOut,
    validaToken,
    consultaClientes,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuarioPorCorreo,
    cambiarContrasena
};