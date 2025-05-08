const db = require('../database');

// Función crear un nuevo caso

async function CrearCaso(idUsuario, idCliente, titulo, descripcion, detalles) {
  const sqlInsert = `
    INSERT INTO CasosLegales 
    (idAbogado, idCliente, titulo, descripcion, idEstado, fechaCreacion, fechaUltimaModificacion, detalles) 
    VALUES (?, ?, ?, ?, 1, strftime('%Y-%m-%d %H:%M:%S', 'now'), strftime('%Y-%m-%d %H:%M:%S', 'now'), ?)`;

  try {
    return new Promise((resolve, reject) => {
      db.run(sqlInsert, [idUsuario, idCliente, titulo, descripcion, detalles], function (err) {
        if (err) {
          console.error('Error al insertar datos del caso', err.message);
          reject(err);
        } else {
          console.log(`Datos insertados correctamente en la tabla con ID: ${this.lastID}`);
          resolve({ idCaso: this.lastID, titulo, descripcion, idEstado: 1, fechaCreacion: new Date(), fechaUltimaModificacion: new Date(), detalles });
        }
      });
    });
  } catch (error) {
    console.error('Error al crear el caso', error.message);
    throw new Error('Error al crear el caso');
  }
}

function EliminaCaso(IdCaso) {
  const sqldelete = `DELETE FROM CasosLegales WHERE idCaso = ?`;
  try {
    db.run(sqldelete, [IdCaso], function (err) {
      if (err) {
         console.error('Error al eliminar el caso', err.message);
         return undefined;
      }
      console.log(`Datos Borrados correctamente`);
    });
    return `Caso eliminado correctamente`;

  } catch (error) {
    console.error('Error al eliminar el caso', error.message);
    return undefined;
  }
}

async function ObtieneCasos() {
  let listaCasos = [];

  try {
    return new Promise((resolve, reject) => {

      const sql = `SELECT
    c.idCaso AS TituloDelCaso,
    c.titulo AS TituloDelCaso,
    c.descripcion AS DescripcionDelCaso,
    c.idEstado AS EstadoDelCaso,
    c.fechaCreacion AS creacion,
    c.fechaUltimaModificacion AS Modificacion,
    u1.nombre AS NombreAbogado,
    u1.apellidos AS ApellidosAbogado,
    u2.nombre AS NombreCliente,
    u2.apellidos AS ApellidosCliente,
    c.detalles as Detalles

FROM
    CasosLegales c
JOIN
    usuarios u1 ON c.idAbogado = u1.idUsuario
JOIN
    usuarios u2 ON c.idCliente = u2.idUsuario`;

      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }
        rows.forEach((row) => {
          
          let caso = {
            TituloDelCaso: row.TituloDelCaso,
            DescripcionDelCaso: row.DescripcionDelCaso,
            EstadoDelCaso: row.EstadoDelCaso,      
            Creacion: row.creacion,          
            Modificacion: row.Modificacion,   
            NombreAbogado: row.NombreAbogado,     
            ApellidosAbogado: row.ApellidosAbogado,    
            NombreCliente: row.NombreCliente,      
            ApellidosCliente: row.ApellidosCliente,   
            Detalles: row.Detalles,   
          };

          listaCasos.push(caso);
        });

        console.log(listaCasos);

        resolve(listaCasos);
        return listaCasos;
      });
    });
  } catch (error) {
    return undefined;
  }
}

function ObtieneCaso(IdCaso) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM CasosLegales WHERE idCaso = ?`;
    db.get(sql, [IdCaso], (err, row) => {
      if (err) {
        console.error('Error al obtener el caso', err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}


async function ObtieneCasosPorClienteYAbogado(idCliente, idAbogado, estado) {
  let listaCasos = [];

  try {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT
        c.idCaso AS IdCaso,
        c.titulo AS TituloDelCaso,
        c.descripcion AS DescripcionDelCaso,
        c.idEstado AS EstadoDelCaso,
        c.fechaCreacion AS Creacion,
        c.fechaUltimaModificacion AS Modificacion,
        u1.nombre AS NombreAbogado,
        u1.apellidos AS ApellidosAbogado,
        u2.nombre AS NombreCliente,
        u2.apellidos AS ApellidosCliente,
        c.detalles AS Detalles
      FROM
        CasosLegales c
      JOIN
        usuarios u1 ON c.idAbogado = u1.idUsuario
      JOIN
        usuarios u2 ON c.idCliente = u2.idUsuario
      WHERE
        c.idCliente = ? AND c.idAbogado = ? AND c.idEstado = ?`;

      db.all(sql, [idCliente, idAbogado, estado], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }
        rows.forEach((row) => {
          let caso = {
            IdCaso: row.IdCaso,
            TituloDelCaso: row.TituloDelCaso,
            DescripcionDelCaso: row.DescripcionDelCaso,
            EstadoDelCaso: row.EstadoDelCaso,
            Creacion: row.Creacion,
            Modificacion: row.Modificacion,
            NombreAbogado: row.NombreAbogado,
            ApellidosAbogado: row.ApellidosAbogado,
            NombreCliente: row.NombreCliente,
            ApellidosCliente: row.ApellidosCliente,
            Detalles: row.Detalles,
          };
          listaCasos.push(caso);
        });

        console.log(listaCasos);

        resolve(listaCasos);
        return listaCasos;
      });
    });
  } catch (error) {
    console.error('Error al obtener los casos', error.message);
    return undefined;
  }
}

async function actualizaEstadoCaso(idCaso, nuevoEstado) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE CasosLegales SET idEstado = ? WHERE idCaso = ?';
    db.run(sql, [nuevoEstado, idCaso], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ idCaso, nuevoEstado });
      }
    });
  });
}

//Funciones para la parte del cliente

async function ObtieneCasosPorCliente(idCliente) {
  let listaCasos = [];

  try {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT
        c.idCaso AS IdCaso,
        c.titulo AS TituloDelCaso,
        c.descripcion AS DescripcionDelCaso,
        c.idEstado AS EstadoDelCaso,
        c.fechaCreacion AS Creacion,
        c.fechaUltimaModificacion AS Modificacion,
        u1.nombre AS NombreAbogado,
        u1.apellidos AS ApellidosAbogado,
        u2.nombre AS NombreCliente,
        u2.apellidos AS ApellidosCliente,
        c.detalles AS Detalles
      FROM
        CasosLegales c
      JOIN
        usuarios u1 ON c.idAbogado = u1.idUsuario
      JOIN
        usuarios u2 ON c.idCliente = u2.idUsuario
      WHERE
        c.idCliente = ?`;

      db.all(sql, [idCliente], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }
        rows.forEach((row) => {
          let caso = {
            IdCaso: row.IdCaso,
            TituloDelCaso: row.TituloDelCaso,
            DescripcionDelCaso: row.DescripcionDelCaso,
            EstadoDelCaso: row.EstadoDelCaso,
            Creacion: row.Creacion,
            Modificacion: row.Modificacion,
            NombreAbogado: row.NombreAbogado,
            ApellidosAbogado: row.ApellidosAbogado,
            NombreCliente: row.NombreCliente,
            ApellidosCliente: row.ApellidosCliente,
            Detalles: row.Detalles,
          };
          listaCasos.push(caso);
        });

        resolve(listaCasos);
        return listaCasos;
      });
    });
  } catch (error) {
    console.error('Error al obtener los casos', error.message);
    return undefined;
  }
}





module.exports = {
  CrearCaso,
  EliminaCaso,
  ObtieneCasos,
  ObtieneCaso,
  ObtieneCasosPorClienteYAbogado,
  actualizaEstadoCaso,
  ObtieneCasosPorCliente,
};