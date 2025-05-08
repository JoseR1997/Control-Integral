const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const resultObj = require('../models/GenericResponse');
const casosController = require('../controllers/casosController'); 
const userController = require('../controllers/userController'); 



async function CrearCaso (req, res)  {
    const { token, idRol, idUsuario, idCliente, titulo, descripcion, detalles } = req.body;
    const result = {
      Code: null,
      Description: '',
      IsSuccessful: false,
      Details: null
    };
  
    try {
      if (idRol === 1) {
        const validaSesion = await userController.validarTokenDeSesion(token);
        if (validaSesion) {
          const casoCreado = await casosController.CrearCaso(idUsuario, idCliente, titulo, descripcion, detalles);
          if (casoCreado) {
            result.Code = 0;
            result.Description = 'Caso creado correctamente';
            result.IsSuccessful = true;
            result.Details = casoCreado;
          } else {
            result.Code = -1;
            result.Description = 'Error al crear el caso';
            result.IsSuccessful = false;
          }
        } else {
          result.Code = -1;
          result.Description = 'Sesión inválida, ingrese de nuevo';
          result.IsSuccessful = false;
        }
      } else {
        result.Code = -1;
        result.Description = 'No cuenta con permisos suficientes';
        result.IsSuccessful = false;
      }
    } catch (error) {
      result.Code = -1;
      result.Description = error.message;
      result.IsSuccessful = false;
    }
  
    res.json(result);
};
  
async function eliminaCaso(req, res) {
    const {token, idRol, idCaso} = req.body;
    const result = Object.assign({}, resultObj);
  
    try {
  
      if(idRol === 1)
      {
        var validaSesion= await userController.validarTokenDeSesion(token);
        if(validaSesion!= undefined)
        {
          var CrearCaso = casosController.EliminaCaso(idCaso);
          if(CrearCaso != undefined)
          {
            result.Code = 0;
            result.Description = CrearCaso;
            result.Issuccessful = true;
            result.Details = null;
          }
        }else
        {
          result.Code = -1;
          result.Description = "Sesión invalida, ingrese de nuevo.";
          result.Issuccessful = false;
          result.Details = null;
        }
      }else
      {
        result.Code = -1;
        result.Description = "No cuenta con permisos suficientes.";
        result.Issuccessful = false;
        result.Details = null;
      }
  
      
    } catch (error) {
      result.Code = -1;
      result.Description = error.message;
      result.Issuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};
  
async function obtieneCaso(req, res)  {
    const { token, idCaso } = req.body;
    const result = {
      Code: null,
      Description: '',
      IsSuccessful: false,
      Details: null
    };
  
    try {
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        const caso = await casosController.ObtieneCaso(idCaso);
        if (caso) {
          result.Code = 0;
          result.Description = 'Caso obtenido correctamente';
          result.IsSuccessful = true;
          result.Details = caso;
        } else {
          result.Code = -1;
          result.Description = 'No se encontró el caso';
          result.IsSuccessful = false;
          result.Details = null;
        }
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        result.Details = null;
      }
    } catch (error) {
      result.Code = -1;
      result.Description = error.message;
      result.IsSuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};
  
async function obtieneCasosPorClienteYAbogado(req, res)  {
    const { token, idRol, idCliente, idAbogado, estado } = req.body;
    const result = {
      Code: null,
      Description: '',
      IsSuccessful: false,
      Details: null
    };
  
    try {
      if (idRol === 1) { 
        const validaSesion = await userController.validarTokenDeSesion(token);
        if (validaSesion) {
          const casos = await casosController.ObtieneCasosPorClienteYAbogado(idCliente, idAbogado, estado);
          if (casos) {
            result.Code = 0;
            result.Description = 'Casos obtenidos correctamente';
            result.IsSuccessful = true;
            result.Details = casos;
          } else {
            result.Code = -1;
            result.Description = 'No se encontraron casos';
            result.IsSuccessful = false;
            result.Details = null;
          }
        } else {
          result.Code = -1;
          result.Description = 'Sesión inválida, ingrese de nuevo';
          result.IsSuccessful = false;
          result.Details = null;
        }
      } else {
        result.Code = -1;
        result.Description = 'No cuenta con permisos suficientes';
        result.IsSuccessful = false;
        result.Details = null;
      }
    } catch (error) {
      result.Code = -1;
      result.Description = error.message;
      result.IsSuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};


async function actualizaEstadoCaso (req, res)  {
    const { token, idRol, idCaso, nuevoEstado } = req.body;
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
          const casoActualizado = await casosController.actualizaEstadoCaso(idCaso, nuevoEstado);
          if (casoActualizado) {
            result.Code = 0;
            result.Description = 'Estado del caso actualizado correctamente';
            result.IsSuccessful = true;
            result.Details = casoActualizado;
          } else {
            result.Code = -1;
            result.Description = 'No se pudo actualizar el estado del caso';
            result.IsSuccessful = false;
            result.Details = null;
          }
        } else {
          result.Code = -1;
          result.Description = 'Sesión inválida, ingrese de nuevo';
          result.IsSuccessful = false;
          result.Details = null;
        }
      } else {
        result.Code = -1;
        result.Description = 'No cuenta con permisos suficientes';
        result.IsSuccessful = false;
        result.Details = null;
      }
    } catch (error) {
      result.Code = -1;
      result.Description = error.message;
      result.IsSuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};
  
async function obtieneCasosPorCliente(req, res) {
    const { token, idCliente } = req.body;
    console.log("Token recibido:", token);
    console.log("ID Cliente recibido:", idCliente);
    const result = {
      Code: null,
      Description: '',
      IsSuccessful: false,
      Details: null
    };
  
    try {
      const validaSesion = await userController.validarTokenDeSesion(token);
      if (validaSesion) {
        const casos = await casosController.ObtieneCasosPorCliente(idCliente);
        console.log("Casos obtenidos:", casos);
        if (casos) {
          result.Code = 0;
          result.Description = 'Casos obtenidos correctamente';
          result.IsSuccessful = true;
          result.Details = casos;
        } else {
          result.Code = -1;
          result.Description = 'No se encontraron casos';
          result.IsSuccessful = false;
          result.Details = null;
        }
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        result.Details = null;
      }
    } catch (error) {
      result.Code = -1;
      result.Description = error.message;
      result.IsSuccessful = false;
      result.Details = null;
    }
  
    res.json(result);
};
  
async function archivaCaso(req, res) {
  const { token, idRol, idCaso } = req.body;
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
        const casoArchivado = await casosController.archivaCaso(idCaso);
        if (casoArchivado) {
          result.Code = 0;
          result.Description = 'Caso archivado correctamente';
          result.IsSuccessful = true;
          result.Details = casoArchivado;
        } else {
          result.Code = -1;
          result.Description = 'Error al archivar el caso';
          result.IsSuccessful = false;
        }
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
      }
    } else {
      result.Code = -1;
      result.Description = 'No cuenta con permisos suficientes';
      result.IsSuccessful = false;
    }
  } catch (error) {
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
  }
  res.json(result);
}


module.exports = {
    CrearCaso,
    eliminaCaso,
    obtieneCaso,
    obtieneCasosPorClienteYAbogado,
    actualizaEstadoCaso,
    obtieneCasosPorCliente,
    archivaCaso,
};