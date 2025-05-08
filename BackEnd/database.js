const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oficina_virtual');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Rol (
      idRol INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre NVARCHAR(255)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Usuarios (
      idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
      idRol INT,
      correo NVARCHAR(255) UNIQUE,
      password NVARCHAR(255),
      cedula NVARCHAR(255),
      nombre NVARCHAR(255),
      apellidos NVARCHAR(255),
      telefono NVARCHAR(255),
      FOREIGN KEY (idRol) REFERENCES Rol(idRol)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS HorariosDisponibles (
      idHorario INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha DATE,
      horarioInicio TIME,
      horarioFin TIME,
      idAbogado INT,
      disponible BIT,
      FOREIGN KEY (idAbogado) REFERENCES Usuarios(idUsuario)
    )
  `);

  db.run(`
CREATE TABLE IF NOT EXISTS estado (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Servicios (
      idServicio INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreServicio NVARCHAR(255),
      descripcion NVARCHAR(255),
      precioBase DECIMAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ParametrosCotizacion (
      idParametro INTEGER PRIMARY KEY AUTOINCREMENT,
      idServicio INT,
      nombreParametro NVARCHAR(255),
      factorCotizacion DECIMAL,
      FOREIGN KEY (idServicio) REFERENCES Servicios(idServicio)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Citas (
      idCita INTEGER PRIMARY KEY AUTOINCREMENT,
      idCliente INT,
      nombre NVARCHAR(255),
      apellido NVARCHAR(255),
      telefono NVARCHAR(255),
      idHorario INT,
      motivoConsulta NVARCHAR(255),
      fechaHora DATETIME,
      FOREIGN KEY (idCliente) REFERENCES Usuarios(idUsuario),
      FOREIGN KEY (idHorario) REFERENCES HorariosDisponibles(idHorario)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS CasosLegales (
      idCaso INTEGER PRIMARY KEY AUTOINCREMENT,
      idAbogado INT,
      idCliente INT,
      titulo NVARCHAR(255),
      descripcion NVARCHAR(255),
      idEstado INT,
      fechaCreacion DATETIME,
      fechaUltimaModificacion DATETIME,
      detalles NVARCHAR(255),
      FOREIGN KEY (idAbogado) REFERENCES Usuarios(idUsuario),
      FOREIGN KEY (idCliente) REFERENCES Usuarios(idUsuario)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ModificacionesCasos (
      idModificacion INTEGER PRIMARY KEY AUTOINCREMENT,
      idCaso INT,
      fechaModificacion DATETIME,
      descripcion NVARCHAR(255),
      realizadoPor INT,
      FOREIGN KEY (idCaso) REFERENCES CasosLegales(idCaso),
      FOREIGN KEY (realizadoPor) REFERENCES Usuarios(idUsuario)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS DocumentosCaso (
      idDocumento INTEGER PRIMARY KEY AUTOINCREMENT,
      idCaso INT,
      idCliente INT,
      nombreDocumento NVARCHAR(255),
      rutaArchivo NVARCHAR(255),
      fechaSubida DATETIME,
      activo BIT,
      FOREIGN KEY (idCaso) REFERENCES CasosLegales(idCaso),
      FOREIGN KEY (idCliente) REFERENCES Usuarios(idUsuario)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS AccesosUsuarios (
      idAcceso INTEGER PRIMARY KEY AUTOINCREMENT,
      idUsuario INT,
      fechaHoraAcceso DATETIME,
      FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS sesiones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL,
      token TEXT NOT NULL,
      horainicio DATETIME NOT NULL,
      horafin DATETIME NOT NULL
      )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS NumerosSeguridad (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idUsuario INT,
      numeroSeguridad NVARCHAR(255),
      codigoBoleta  NVARCHAR(255),
      tipo NVARCHAR(255),
      FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario)
    )
  `);
  
  
});

module.exports = db;
