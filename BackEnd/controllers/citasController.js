const db = require('../database');
const { sendMessage } = require('../whatsappClient');

function crearHorario(data, callback) {
  const query = `INSERT INTO HorariosDisponibles (fecha, horarioInicio, horarioFin, idAbogado, disponible) VALUES (?, ?, ?, ?, ?)`;
  const params = [data.fecha, data.horarioInicio, data.horarioFin, data.idAbogado, data.disponible];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error al crear el horario:', err);
      callback(err, null);
    } else {
      console.log('Horario creado con ID:', this.lastID);
      callback(null, this.lastID);
    }
  });
}

function obtenerHorarios(fecha, callback) {
  const query = `SELECT * FROM HorariosDisponibles WHERE fecha = ?`;
  db.all(query, [fecha], (err, rows) => {
    if (err) {
      console.error('Error al obtener los horarios:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function eliminarHorario(idHorario, callback) {
  // Primero, verificamos si hay una cita asociada a este horario
  const checkCitaQuery = `SELECT idCita FROM Citas WHERE idHorario = ?`;
  
  db.get(checkCitaQuery, [idHorario], (err, row) => {
    if (err) {
      console.error('Error al verificar cita asociada:', err);
      return callback(err, null);
    }

    if (row && row.idCita) {
      const deleteCitaQuery = `DELETE FROM Citas WHERE idCita = ?`;
      db.run(deleteCitaQuery, [row.idCita], (err) => {
        if (err) {
          console.error('Error al eliminar cita asociada:', err);
          return callback(err, null);
        }
        console.log('Cita asociada eliminada:', row.idCita);
        procederConEliminacionHorario();
      });
    } else {
      procederConEliminacionHorario();
    }
  });

  function procederConEliminacionHorario() {
    const deleteHorarioQuery = `DELETE FROM HorariosDisponibles WHERE idHorario = ?`;
    db.run(deleteHorarioQuery, [idHorario], function(err) {
      if (err) {
        console.error('Error al eliminar el horario:', err);
        return callback(err, null);
      }
      console.log('Horario eliminado con ID:', idHorario);
      callback(null, idHorario);
    });
  }
}

//Citas

function crearCita(client, data, callback) {
  console.log('Iniciando crearCita con datos:', data);
  const query = "INSERT INTO Citas (idCliente, nombre, apellido, telefono, idHorario, motivoConsulta) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [data.idCliente, data.nombre, data.apellido, data.telefono, data.idHorario, data.motivoConsulta];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error al crear la cita:', err);
      return callback(err, null);
    }
    console.log('Cita creada con ID:', this.lastID);
    const updateQuery = "UPDATE HorariosDisponibles SET disponible = 0 WHERE idHorario = ?";

    db.run(updateQuery, [data.idHorario], function(updateErr) {
      if (updateErr) {
        console.error('Error al actualizar el horario a no disponible:', updateErr);
        return callback(updateErr, null);
      }

      console.log('Horario actualizado a no disponible:', data.idHorario);

      const selectQuery = "SELECT fecha, horarioInicio FROM HorariosDisponibles WHERE idHorario = ?";
      db.get(selectQuery, [data.idHorario], async (selectErr, row) => {
        if (selectErr) {
          console.error('Error al obtener fecha y hora de la cita:', selectErr);
          return callback(selectErr, null);
        }

        const { fecha, horarioInicio } = row;

        const message = `Hola ${data.nombre}, su cita ha sido programada para la fecha ${fecha} a las ${horarioInicio}.`;
        const formattedNumber = `506${data.telefono}`;

        try {
          await sendMessage(formattedNumber, message);
          console.log('Mensajes de confirmación enviados');
          callback(null, this.lastID);
        } catch (sendErr) {
          console.error('Error al enviar los mensajes de confirmación:', sendErr);
          callback(sendErr, null);
        }
      });
    });
  });
}

function crearCitaCliente( client, data, callback) {
  const query = "INSERT INTO Citas (idCliente, nombre, apellido, telefono, idHorario, motivoConsulta) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [data.idCliente, data.nombre, data.apellido, data.telefono, data.idHorario, data.motivoConsulta];
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error al crear la cita:', err);
      callback(err, null);
    } else {
      console.log('Cita creada con ID:', this.lastID);
      const updateQuery = "UPDATE HorariosDisponibles SET disponible = 0 WHERE idHorario = ?";
      db.run(updateQuery, [data.idHorario], async function(updateErr) {
        if (updateErr) {
          console.error('Error al actualizar el horario a no disponible:', updateErr);
          callback(updateErr, null);
        } else {
          console.log('Horario actualizado a no disponible:', data.idHorario);
          
          const selectQuery = "SELECT fecha, horarioInicio FROM HorariosDisponibles WHERE idHorario = ?";
          db.get(selectQuery, [data.idHorario], async (selectErr, row) => {
            if (selectErr) {
              console.error('Error al obtener fecha y hora de la cita:', selectErr);
              callback(selectErr, null);
            } else {
              const { fecha, horarioInicio } = row;
              
              const message = `Hola ${data.nombre}, su cita ha sido programada para la fecha y hora seleccionada.`;
              const formattedNumber = `506${data.telefono}`;
              
              const message2 = `El cliente ${data.nombre}, ha programado una cita para la fecha ${fecha} a las ${horarioInicio}.`;
              const formattedNumber2 = `50661025813`;
              
              try {
                await sendMessage(formattedNumber, message);
                await sendMessage(formattedNumber2, message2);
                console.log('Mensajes de confirmación enviados');
              } catch (err) {
                console.error('Error al enviar los mensajes de confirmación:', err);
              }
              callback(null, this.lastID);
            }
          });
        }
      });
    }
  });
}

function obtenerCita(idHorario, callback) {
  const query = `SELECT * FROM Citas WHERE idHorario = ?`;
  console.log('Ejecutando query:', query);
  console.log('Con parámetro idHorario:', idHorario);
  db.get(query, [idHorario], (err, row) => {
    if (err) {
      console.error('Error al obtener la cita:', err);
      callback(err, null);
    } else {
      console.log('Resultado de la query:', row);
      callback(null, row);
    }
  });
}

function cancelarCita(idCita,callback) {
  const getInfoQuery = `
    SELECT c.idHorario, c.telefono, h.fecha, h.horarioInicio 
    FROM Citas c
    JOIN HorariosDisponibles h ON c.idHorario = h.idHorario
    WHERE c.idCita = ?`;

  db.get(getInfoQuery, [idCita], function(err, row) {
    if (err) {
      console.error('Error al obtener la información de la cita:', err);
      callback(err, null);
    } else if (!row) {
      console.error('Cita no encontrada con ID:', idCita);
      callback(new Error('Cita no encontrada'), null);
    } else {
      const { idHorario, telefono, fecha, horarioInicio } = row;

      const deleteQuery = "DELETE FROM Citas WHERE idCita = ?";
      db.run(deleteQuery, [idCita], function(err) {
        if (err) {
          console.error('Error al cancelar la cita:', err);
          callback(err, null);
        } else {
          console.log('Cita cancelada con ID:', idCita);
          const updateQuery = "UPDATE HorariosDisponibles SET disponible = 1 WHERE idHorario = ?";
          db.run(updateQuery, [idHorario], async function(updateErr) {
            if (updateErr) {
              console.error('Error al actualizar el horario a disponible:', updateErr);
              callback(updateErr, null);
            } else {
              console.log('Horario actualizado a disponible:', idHorario);

              const formattedDate = fecha;
              const formattedTime = horarioInicio.slice(0, 5);

              const message = `Su cita de la fecha ${formattedDate} a la hora ${formattedTime} ha sido cancelada. Para reprogramar su cita puede ponerse en contacto por este medio o por la página web.`;
              const formattedNumber = `506${telefono}`;

              try {
                await sendMessage(formattedNumber, message);
                console.log('Mensaje de cancelación enviado a', telefono);
                callback(null, idCita);
              } catch (sendErr) {
                console.error('Error al enviar el mensaje de cancelación:', sendErr);
                callback(sendErr, null);
              }
            }
          });
        }
      });
    }
  });
}

function getCitasDia(fecha, callback) {
  const query = `
    SELECT 
      Citas.nombre, 
      Citas.apellido, 
      Citas.telefono, 
      Citas.motivoConsulta,
      HorariosDisponibles.horarioInicio, 
      HorariosDisponibles.horarioFin 
    FROM 
      Citas 
    INNER JOIN 
      HorariosDisponibles 
    ON 
      Citas.idHorario = HorariosDisponibles.idHorario 
    WHERE 
      HorariosDisponibles.fecha = ?`;

  db.all(query, [fecha], (err, rows) => {
    if (err) {
      console.error('Error al obtener las citas del día:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function getCitasProximosDias(callback) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fiveDaysLater = new Date(tomorrow);
  fiveDaysLater.setDate(tomorrow.getDate() + 4);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const startDate = formatDate(tomorrow);
  const endDate = formatDate(fiveDaysLater);

  const query = `
    SELECT
      Citas.nombre,
      Citas.apellido,
      Citas.telefono,
      Citas.idHorario,
      Citas.motivoConsulta,
      HorariosDisponibles.fecha,
      HorariosDisponibles.horarioInicio,
      HorariosDisponibles.horarioFin
    FROM
      Citas
    INNER JOIN
      HorariosDisponibles
    ON
      Citas.idHorario = HorariosDisponibles.idHorario
    WHERE
      HorariosDisponibles.fecha BETWEEN ? AND ?
    ORDER BY
      HorariosDisponibles.fecha,
      HorariosDisponibles.horarioInicio`;

  db.all(query, [startDate, endDate], (err, rows) => {
    if (err) {
      console.error('Error al obtener las citas de los próximos días:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function obtenerCitasCliente(idCliente, callback) {
  const query = `
    SELECT 
      c.idCita,
      c.idCliente,
      c.nombre,
      c.apellido,
      c.telefono,
      c.idHorario,
      c.motivoConsulta,
      h.fecha,
      h.horarioInicio
    FROM Citas c
    JOIN HorariosDisponibles h ON c.idHorario = h.idHorario
    WHERE c.idCliente = ?
    ORDER BY h.fecha ASC, h.horarioInicio ASC
  `;

  db.all(query, [idCliente], (err, rows) => {
    if (err) {
      console.error('Error al obtener las citas del cliente:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = {
  obtenerCitasCliente,
  getCitasProximosDias,
  crearCitaCliente,
  getCitasDia,
  crearHorario,
  obtenerHorarios,
  crearCita,
  obtenerCita,
  cancelarCita,
  eliminarHorario
};
