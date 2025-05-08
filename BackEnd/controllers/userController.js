const jwt = require('jsonwebtoken');
const tokenModel = require('../models/userModels/newSessionModel');
const db = require('../database');

// Función para generar un token de sesión este se llama en el login
function generarToken(usuario, idRol) {
  const sqlInsert = `INSERT INTO sesiones (usuario, token, horainicio, horafin) VALUES (?, ?, ?, ?)`;
  const sqldelete = `DELETE FROM sesiones WHERE usuario = ?`;

  try {
    db.run(sqldelete, [usuario], function (err) {
      if (err) {
        return console.error('Error al Eliminar la sesión', err.message);
      }
    });

    const horaInicio = new Date();
    const fechafin = new Date();
    fechafin.setHours(horaInicio.getHours() + 1);

    const fin = fechafin.toString();
    const token = jwt.sign({ usuario, idRol, fin }, 'secreto', { expiresIn: '1h' });

    const sessionResult = { ...tokenModel, usuario, token, horainicio: horaInicio, horafin: fechafin };

    db.run(sqlInsert, [sessionResult.usuario, sessionResult.token, sessionResult.horainicio, sessionResult.horafin], function (err) {
      if (err) {
        return console.error('Error al insertar datos de sesión', err.message);
      }
      console.log(`Datos insertados correctamente en la tabla con ID: ${this.lastID}`);
    });
    return sessionResult;

  } catch (error) {
    console.error('Error al crear la sesión', error.message);
    return { ...tokenModel, usuario: null, token: null, horainicio: null, horafin: null };
  }
}

function LogOut(usuario) {
  const sqldelete = `DELETE FROM sesiones WHERE usuario = ?`;

  try {
    db.run(sqldelete, [usuario], function (err) {
      if (err) {
        return console.error('Error al Eliminar la sesión', err.message);
      }
    });

    return "Se ha cerrado la sesion";

  } catch (error) {
    return undefined;
  }
}

// Función para validar el token de sesión
async function validarTokenDeSesion(token) {
  try {
    return new Promise((resolve, reject) => {
      let FechaInicio = null;
      let FechaFin = null;

      const sql = `SELECT horainicio AS INICIO, horafin AS FIN FROM sesiones where token = ?`;

      db.all(sql, [token], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }

        rows.forEach((row) => {
          FechaInicio = new Date(row.INICIO);
          FechaFin = new Date(row.FIN);
        });

        const fechaActual = new Date();
        let result;
        if (FechaFin != null) {
          result = fechaActual >= FechaInicio ? 'SESIÓN VÁLIDA' : undefined;
        }
        resolve(result);
      });
    });
  } catch (error) {
    return undefined;
  }
}

// Función para consultar clientes
function consultaClientes() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Usuarios WHERE idRol = 2`;
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

// Función para consultar un usuario por correo y contraseña
async function consultaUsuario(usuario, contrasena) {
  try {
    return new Promise((resolve, reject) => {
      const usuarioOBJ = {};

      const sql = `SELECT idUsuario, idRol, correo, cedula, nombre, apellidos, telefono FROM Usuarios WHERE correo = ? AND password = ?`;

      db.all(sql, [usuario, contrasena], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }

        rows.forEach((row) => {
          usuarioOBJ.idUsuario = row.idUsuario;
          usuarioOBJ.idRol = row.idRol;
          usuarioOBJ.correo = row.correo;
          usuarioOBJ.cedula = row.cedula;
          usuarioOBJ.nombre = row.nombre;
          usuarioOBJ.apellidos = row.apellidos;
          usuarioOBJ.telefono = row.telefono;
        });

        resolve(Object.keys(usuarioOBJ).length ? usuarioOBJ : undefined);
      });
    });
  } catch (error) {
    console.error('Error in consultaUsuario:', error);
    return undefined;
  }
}

// Función para generar una contraseña
function generatePassword(nombre, apellidos) {
  const namePart = nombre.slice(0, 3);
  const lastNamePart = apellidos.slice(0, 2);
  const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
  return `${namePart}${lastNamePart}${randomNumbers}`;
}

// Función para crear un usuario con el rol de cliente
const CLIENT_ROLE_ID = 2;
function crearUsuario(usuario, callback) {
  const { correo, cedula, nombre, apellidos, telefono } = usuario;
  const password = generatePassword(nombre, apellidos);
  const query = `INSERT INTO Usuarios (idRol, correo, password, cedula, nombre, apellidos, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [CLIENT_ROLE_ID, correo, password, cedula, nombre, apellidos, telefono], function (err) {
    callback(err, this ? this.lastID : null);
  });
}

// Función para actualizar un usuario sin cambiar el idRol
function actualizarUsuario(idUsuario, usuario, callback) {
  const { correo, password, cedula, nombre, apellidos, telefono } = usuario;
  const query = `UPDATE Usuarios SET correo = ?, password = ?, cedula = ?, nombre = ?, apellidos = ?, telefono = ? WHERE idUsuario = ?`;
  db.run(query, [correo, password, cedula, nombre, apellidos, telefono, idUsuario], function (err) {
    callback(err);
  });
}

// Función para eliminar un usuario existente
function eliminarUsuario(idUsuario, callback) {
  const query = `DELETE FROM Usuarios WHERE idUsuario = ?`;
  db.run(query, [idUsuario], function (err) {
    callback(err);
  });
}

// Función para obtener un usuario por correo
async function obtenerUsuarioPorCorreo(correo) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Usuarios WHERE correo = ?`;
    db.get(query, [correo], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Función para cambiar la contraseña
async function cambiarContrasena(usuario, contrasenaActual, nuevaContrasena) {
  return new Promise((resolve, reject) => {
    const sqlVerificar = `SELECT * FROM Usuarios WHERE correo = ? AND password = ?`;
    db.get(sqlVerificar, [usuario, contrasenaActual], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (!row) {
        reject(new Error('Contraseña actual incorrecta'));
        return;
      }
      const sqlActualizar = `UPDATE Usuarios SET password = ? WHERE correo = ?`;
      db.run(sqlActualizar, [nuevaContrasena, usuario], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve('Contraseña actualizada exitosamente');
        }
      });
    });
  });
}

module.exports = {
  generarToken,
  validarTokenDeSesion,
  consultaUsuario,
  consultaClientes,
  LogOut,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarContrasena,
  obtenerUsuarioPorCorreo,
};
