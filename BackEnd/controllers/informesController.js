///////////////////MANEJO DE INFORMES
const db = require('../database');

// Función para obtener el informe de accesos de usuarios
async function obtenerInformeAccesos() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT idUsuario, fechaHoraAcceso FROM AccesosUsuarios`;
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  function obtenerNumerosSeguridad() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM NumerosSeguridad`;
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  // Función para añadir un número de seguridad
  function agregarNumeroSeguridad(numeroSeguridadData) {
    return new Promise((resolve, reject) => {
      const { idUsuario, numeroSeguridad, codigoBoleta, tipo } = numeroSeguridadData;
      const query = `INSERT INTO NumerosSeguridad (idUsuario, numeroSeguridad, codigoBoleta, tipo) VALUES (?, ?, ?, ?)`;
      db.run(query, [idUsuario, numeroSeguridad, codigoBoleta, tipo], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
  // Función para actualizar un número de seguridad
  function actualizarNumeroSeguridad(numeroSeguridadId, numeroSeguridadData) {
    return new Promise((resolve, reject) => {
      const { idUsuario, numeroSeguridad, tipo } = numeroSeguridadData;
      const query = `
        UPDATE NumerosSeguridad 
        SET idUsuario = ?, numeroSeguridad = ?, tipo = ?
        WHERE id = ?`;
      db.run(query, [idUsuario, numeroSeguridad, tipo, numeroSeguridadId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  // Función para eliminar un número de seguridad
  function eliminarNumeroSeguridad(numeroSeguridadId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM NumerosSeguridad WHERE id = ?`;
      db.run(query, [numeroSeguridadId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  // Función para obtener el registro de modificaciones de casos
  async function obtenerRegistroModificaciones() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT idCaso, fechaModificacion, descripcion, realizadoPor FROM ModificacionesCasos`;
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  // Función para obtener el informe de citas agendadas
  async function obtenerInformeCitas() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT idCita, idCliente, nombre, apellido, telefono, idHorario, motivoConsulta, fechaHora FROM Citas`;
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  // Función para obtener el informe de casos creados y archivados en el mes
  async function obtenerInformeCasos() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          (SELECT COUNT(*) FROM CasosLegales WHERE idEstado = 2 AND strftime('%Y-%m', fechaUltimaModificacion) = strftime('%Y-%m', 'now')) AS casosArchivados,
          (SELECT COUNT(*) FROM CasosLegales WHERE strftime('%Y-%m', fechaCreacion) = strftime('%Y-%m', 'now')) AS casosCreados
      `;
      db.get(sql, [], (err, row) => {
        if (err) {
          console.error('Error al obtener el informe de casos', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  

  module.exports = { 
 obtenerNumerosSeguridad,
    obtenerInformeAccesos,
    agregarNumeroSeguridad,
    actualizarNumeroSeguridad,
    eliminarNumeroSeguridad,
    obtenerRegistroModificaciones,
    obtenerInformeCitas,
    obtenerInformeCasos
  };