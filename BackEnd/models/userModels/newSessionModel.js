// Definir el modelo de objeto
const tokenModel = {
    idUsuario: 0,
    idRol:0,
    usuario: '',        // Nombre de usuario
    token: '',          // Token
    horainicio: null,   // Hora de inicio (puede ser un objeto Date)
    horafin: null       // Hora de fin (puede ser un objeto Date)
  };
  
  // Exportar el modelo para usarlo en otros archivos
  module.exports = tokenModel;
  