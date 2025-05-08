const fs = require('fs');
const path = require('path');
const db = require('../database');


const uploadDirectory = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Función para guardar un documento
async function guardarDocumento(idCaso, idCliente, nombreDocumento, archivo) {
    const clienteDir = path.join(uploadDirectory, String(idCliente));

    if (!fs.existsSync(clienteDir)) {
        fs.mkdirSync(clienteDir);
    }

    const rutaArchivo = path.join(clienteDir, archivo.originalname);

    try {
        fs.writeFileSync(rutaArchivo, archivo.buffer);

        const sqlInsert = `
      INSERT INTO DocumentosCaso (idCaso, idCliente, nombreDocumento, rutaArchivo, fechaSubida, activo)
      VALUES (?, ?, ?, ?, datetime('now'), 1)
    `;

        return new Promise((resolve, reject) => {
            db.run(sqlInsert, [idCaso, idCliente, nombreDocumento, rutaArchivo], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(`Documento guardado con éxito: ${this.lastID}`);
            });
        });
    } catch (error) {
        console.error('Error al guardar el documento:', error.message);
        throw new Error('Error al guardar el documento');
    }
}

// Función para eliminar un documento
async function eliminarDocumento(idDocumento) {
    const sqlSelect = `SELECT rutaArchivo FROM DocumentosCaso WHERE idDocumento = ?`;
    const sqlDelete = `DELETE FROM DocumentosCaso WHERE idDocumento = ?`;

    return new Promise((resolve, reject) => {
        db.get(sqlSelect, [idDocumento], (err, row) => {
            if (err) {
                return reject(err);
            }

            if (!row) {
                return reject(new Error('Documento no encontrado'));
            }

            fs.unlink(row.rutaArchivo, (err) => {
                if (err) {
                    return reject(err);
                }

                db.run(sqlDelete, [idDocumento], function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve('Documento eliminado con éxito');
                });
            });
        });
    });
}

// Función para obtener todos los documentos de un cliente
async function obtenerDocumentosPorCliente(idCliente) {
    const sqlSelect = `SELECT * FROM DocumentosCaso WHERE idCliente = ? AND activo = 1`;

    return new Promise((resolve, reject) => {
        db.all(sqlSelect, [idCliente], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// Función para obtener todos los documentos de un caso
async function obtenerDocumentosPorCaso(idCaso) {
    const sqlSelect = `SELECT * FROM DocumentosCaso WHERE idCaso = ? AND activo = 1`;

    return new Promise((resolve, reject) => {
        db.all(sqlSelect, [idCaso], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// Función para descargar un documento
function descargarDocumento(idDocumento) {
    return new Promise((resolve, reject) => {
      const sqlSelect = `SELECT rutaArchivo, nombreDocumento FROM DocumentosCaso WHERE idDocumento = ? AND activo = 1`;
  
      db.get(sqlSelect, [idDocumento], (err, row) => {
        if (err) {
          return reject(err);
        }
        if (!row) {
          return reject(new Error('Documento no encontrado'));
        }
        const filePath = path.resolve(row.rutaArchivo); 
        console.log(`File path: ${filePath}, Nombre Documento: ${row.nombreDocumento}`);
        resolve({ filePath, nombreDocumento: row.nombreDocumento });
      });
    });
  }


module.exports = {
    guardarDocumento,
    eliminarDocumento,
    obtenerDocumentosPorCliente,
    obtenerDocumentosPorCaso,
    descargarDocumento,
};


