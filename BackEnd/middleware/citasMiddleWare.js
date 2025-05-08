const {
  obtenerCitasCliente,
  crearHorario,
  obtenerHorarios,
  crearCita,
  obtenerCita,
  crearCitaCliente,
  cancelarCita,
  getCitasDia,
  getCitasProximosDias,
  eliminarHorario
} = require('../controllers/citasController');
const userController = require('../controllers/userController');
const util = require('util');

async function crearHorarioMiddleware(req, res) {
  const { token, idRol, fecha, horarioInicio, horarioFin, idAbogado, disponible } = req.body;
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  console.log('Request body:', req.body);

  try {
    if (idRol === 1 || 2 ) {
      const validaSesion = await userController.validarTokenDeSesion(token);
      console.log('Validación de sesión:', validaSesion);

      if (validaSesion) {
        crearHorario({ fecha, horarioInicio, horarioFin, idAbogado, disponible }, (err, horarioId) => {
          if (err) {
            console.error('Error al crear el horario:', err);
            result.Code = -1;
            result.Description = 'Error al crear el horario';
            result.IsSuccessful = false;
            result.Details = null;
          } else {
            console.log('Horario creado con ID:', horarioId);
            result.Code = 0;
            result.Description = 'Horario creado con éxito';
            result.IsSuccessful = true;
            result.Details = { horarioId };
          }
          res.json(result);
        });
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        result.Details = null;
        res.json(result);
      }
    } else {
      result.Code = -1;
      result.Description = 'No cuenta con permisos suficientes';
      result.IsSuccessful = false;
      result.Details = null;
      res.json(result);
    }
  } catch (error) {
    console.error('Error en el middleware:', error);
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.json(result);
  }
}

async function obtenerHorariosMiddleware(req, res) {
  const { fecha } = req.params;
  console.log(`Fecha recibida en el parámetro: ${fecha}`);
  
  try {
    obtenerHorarios(fecha, (err, horarios) => {
      if (err) {
        console.error('Error al obtener los horarios:', err);
        return res.status(500).json({ error: 'Error al obtener los horarios' });
      }
      console.log('Horarios obtenidos:', horarios);
      res.json(horarios);
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

async function cancelarHorarioMiddleware(req, res) {
  const { token, idRol, idHorario } = req.body;
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  console.log('Request body:', req.body);

  try {
    if (idRol === 1) {
      const validaSesion = await userController.validarTokenDeSesion(token);
      console.log('Validación de sesión:', validaSesion);

      if (validaSesion) {
        eliminarHorario(idHorario, (err, horarioId) => {
          if (err) {
            console.error('Error al cancelar el horario:', err);
            result.Code = -1;
            result.Description = 'Error al cancelar el horario';
            result.IsSuccessful = false;
            result.Details = null;
          } else {
            console.log('Horario cancelado con ID:', horarioId);
            result.Code = 0;
            result.Description = 'Horario cancelado con éxito';
            result.IsSuccessful = true;
            result.Details = { horarioId };
          }
          res.json(result);
        });
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        result.Details = null;
        res.json(result);
      }
    } else {
      result.Code = -1;
      result.Description = 'No cuenta con permisos suficientes';
      result.IsSuccessful = false;
      result.Details = null;
      res.json(result);
    }
  } catch (error) {
    console.error('Error en el middleware:', error);
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.json(result);
  }
}

//Citas

async function crearCitaMiddleware(client, req, res) {
  console.log('Iniciando crearCitaMiddleware');
  const { token, idRol, idCliente, nombre, apellido, telefono, idHorario, motivoConsulta } = req.body;
  console.log('Datos recibidos:', { token, idRol, idCliente, nombre, apellido, telefono, idHorario, motivoConsulta });
  
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  try {
    if (idRol !== 1 && idRol !== 2) {
      result.Code = -1;
      result.Description = 'No cuenta con permisos suficientes';
      result.IsSuccessful = false;
      result.Details = null;
      return res.json(result);
    }

    console.log('Intentando validar token de sesión');
    const validaSesion = await userController.validarTokenDeSesion(token);
    console.log('Resultado de validarTokenDeSesión:', validaSesion);

    if (!validaSesion) {
      result.Code = -1;
      result.Description = 'Sesión inválida, ingrese de nuevo';
      result.IsSuccessful = false;
      result.Details = null;
      return res.json(result);
    }

    const crearCitaFunction = idRol === 1 ? crearCita : crearCitaCliente;

    // Convertir crearCitaFunction a una promesa
    const crearCitaPromise = util.promisify(crearCitaFunction);

    const citaId = await crearCitaPromise(client, { idCliente, nombre, apellido, telefono, idHorario, motivoConsulta });
    console.log('Cita creada con ID:', citaId);

    result.Code = 0;
    result.Description = 'Cita creada con éxito';
    result.IsSuccessful = true;
    result.Details = { citaId };

  } catch (error) {
    console.error('Error al crear la cita:', error);
    result.Code = -1;
    result.Description = 'Error al crear la cita';
    result.IsSuccessful = false;
    result.Details = null;
  }

  res.json(result);
}

async function obtenerCitaMiddleware(req, res) {
  const { idHorario } = req.params;
  console.log(`idHorario recibido en el parámetro: ${idHorario}`);
 
  try {
    obtenerCita(idHorario, (err, cita) => {
      if (err) {
        console.error('Error al obtener la cita:', err);
        return res.status(500).json({ error: 'Error al obtener la cita' });
      }
      console.log('Cita obtenida:', cita);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      res.json(cita);
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

async function cancelarCitaMiddleware(client, req, res) {
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  const { token, idRol, idCita } = req.body;
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  console.log('Request body:', req.body);

  try {
    if (idRol === 1 || 2) {
      const validaSesion = await userController.validarTokenDeSesion(token);
      console.log('Validación de sesión:', validaSesion);

      if (validaSesion) {
        cancelarCita(idCita,client, (err, citaId) => {
          if (err) {
            console.error('Error al cancelar la cita:', err);
            result.Code = -1;
            result.Description = 'Error al cancelar la cita';
            result.IsSuccessful = false;
            result.Details = null;
          } else {
            console.log('Cita cancelada con ID:', citaId);
            result.Code = 0;
            result.Description = 'Cita cancelada con éxito';
            result.IsSuccessful = true;
            result.Details = { citaId };
          }
          res.json(result);
        });
      } else {
        result.Code = -1;
        result.Description = 'Sesión inválida, ingrese de nuevo';
        result.IsSuccessful = false;
        result.Details = null;
        res.json(result);
      }
    } else {
      result.Code = -1;
      result.Description = 'No cuenta con permisos suficientes';
      result.IsSuccessful = false;
      result.Details = null;
      res.json(result);
    }
  } catch (error) {
    console.error('Error en el middleware:', error);
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.json(result);
  }
}

async function getCitasDiaMiddleware(req, res) {
  const { token, fecha } = req.body;

  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  try {
    const validaSesion = await userController.validarTokenDeSesion(token);
    console.log('Validación de sesión:', validaSesion);

    if (validaSesion) {
      getCitasDia(fecha, (err, citas) => {
        if (err) {
          console.error('Error al obtener las citas del día:', err);
          result.Code = -1;
          result.Description = 'Error al obtener las citas del día';
          result.IsSuccessful = false;
          result.Details = null;
        } else {
          result.Code = 0;
          result.Description = 'Citas obtenidas con éxito';
          result.IsSuccessful = true;
          result.Details = citas;
        }
        res.json(result);
      });
    } else {
      result.Code = -1;
      result.Description = 'Sesión inválida, ingrese de nuevo';
      result.IsSuccessful = false;
      result.Details = null;
      res.json(result);
    }
  } catch (error) {
    console.error('Error en el middleware:', error);
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.json(result);
  }
}

async function getCitasProximosDiasMiddleware(req, res) {
  const { token } = req.body;
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  try {
    const validaSesion = await userController.validarTokenDeSesion(token);
    console.log('Validación de sesión:', validaSesion);

    if (validaSesion) {
      getCitasProximosDias((err, citas) => {
        if (err) {
          console.error('Error al obtener las citas de los próximos días:', err);
          result.Code = -1;
          result.Description = 'Error al obtener las citas de los próximos días';
          result.IsSuccessful = false;
          result.Details = null;
        } else {
          result.Code = 0;
          result.Description = 'Citas de los próximos días obtenidas con éxito';
          result.IsSuccessful = true;
          result.Details = citas;
        }
        res.json(result);
      });
    } else {
      result.Code = -1;
      result.Description = 'Sesión inválida, ingrese de nuevo';
      result.IsSuccessful = false;
      result.Details = null;
      res.json(result);
    }
  } catch (error) {
    console.error('Error en el middleware:', error);
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.json(result);
  }
}

async function obtenerCitasClienteMiddleware(req, res) {
  const { token, idCliente } = req.body;
  const result = {
    Code: null,
    Description: '',
    IsSuccessful: false,
    Details: null,
  };

  try {
    const validaSesion = await userController.validarTokenDeSesion(token);
    console.log('Validación de sesión:', validaSesion);

    if (validaSesion) {
      obtenerCitasCliente(idCliente, (err, citas) => {
        if (err) {
          console.error('Error al obtener las citas del cliente:', err);
          result.Code = -1;
          result.Description = 'Error al obtener las citas del cliente';
          result.IsSuccessful = false;
          result.Details = null;
        } else {
          result.Code = 0;
          result.Description = 'Citas del cliente obtenidas con éxito';
          result.IsSuccessful = true;
          result.Details = citas;
        }
        res.json(result);
      });
    } else {
      result.Code = -1;
      result.Description = 'Sesión inválida, ingrese de nuevo';
      result.IsSuccessful = false;
      result.Details = null;
      res.json(result);
    }
  } catch (error) {
    console.error('Error en el middleware:', error);
    result.Code = -1;
    result.Description = error.message;
    result.IsSuccessful = false;
    result.Details = null;
    res.json(result);
  }
}

module.exports = { 
  obtenerCitasClienteMiddleware,
  getCitasProximosDiasMiddleware,
  getCitasDiaMiddleware,
  crearHorarioMiddleware, 
  obtenerHorariosMiddleware,
  crearCitaMiddleware,
  obtenerCitaMiddleware, 
  cancelarCitaMiddleware,
  cancelarHorarioMiddleware
};
