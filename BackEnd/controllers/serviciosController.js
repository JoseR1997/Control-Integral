const fs = require('fs');
const path = require('path');
const db = require('../database');

const uploadDirectory = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Función para guardar un servicio
async function guardarServicio(nombreServicio, descripcion, precioBase) {
      try {
          const sqlInsert = `
              INSERT INTO Servicios (nombreServicio, descripcion, precioBase)
              VALUES (?, ?, ?)
          `;
  
          return new Promise((resolve, reject) => {
              db.run(sqlInsert, [nombreServicio, descripcion, precioBase], function (err) {
                  if (err) {
                      return reject(err);
                  }
                  resolve(`Servicio guardado con éxito: ${this.lastID}`);
              });
          });
      } catch (error) {
          console.error('Error al guardar el servicio:', error.message);
          throw new Error('Error al guardar el servicio');
      }
  } 

  // Función para obtener todos los servicios
  async function obtenerServicios() {
      const sqlSelect = `SELECT * FROM Servicios`;
  
      return new Promise((resolve, reject) => {
          db.all(sqlSelect, (err, rows) => {
              if (err) {
                  return reject(err);
              }
              resolve(rows);
          });
      });
  }

  async function actualizarServicio(idServicio, nombreServicio, descripcion, precioBase) {
      try {
          const sqlUpdate = `UPDATE Servicios SET nombreServicio = ?, descripcion = ?, precioBase = ? WHERE idServicio = ?`;
    
          return new Promise((resolve, reject) => {
              db.run(sqlUpdate, [nombreServicio, descripcion, precioBase, idServicio], function (err) {
                  if (err) {
                      return reject(err);
                  }
                  resolve(`Servicio actualizado con éxito. Filas afectadas: ${this.changes}`);
              });
          });
      } catch (error) {
          console.error('Error al actualizar el servicio:', error.message);
          throw new Error('Error al actualizar el servicio');
      }
  }
  
  function eliminarServicio(idServicio) {
    const sqldelete = `DELETE FROM Servicios WHERE idServicio = ?`;
    try {
      db.run(sqldelete, [idServicio], function (err) {
        if (err) {
           console.error('Error al eliminar el Servicio', err.message);
           return undefined;
        }
        console.log(`Datos Borrados correctamente`);
      });
      return `Servicio eliminado correctamente`;
  
    } catch (error) {
      console.error('Error al eliminar el caso', error.message);
      return undefined;
    }
  }
  
  
  module.exports = {
      guardarServicio,
      obtenerServicios,
      actualizarServicio,
      eliminarServicio,
  };
  