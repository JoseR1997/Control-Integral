const express = require('express');
const router = express.Router();
const MiddelWares = require('../middleware/userMiddleware');

router.post('/login', MiddelWares.Login); // Login de la aplicacion
router.post('/LogOut', MiddelWares.LogOut); //Log Out de la aplicacion
router.post('/valida-token', MiddelWares.validaToken); // Endpoint  por si es necesario validar la sesiòn desde FE
router.get('/api/usuarios/clientes', MiddelWares.consultaClientes); // consulta todos los clientes 
router.post('/api/CrearUsuario', MiddelWares.crearUsuario); //Crea los usuarios
router.put('/api/usuarios/:idUsuario', MiddelWares.actualizarUsuario); // Actualizar un usuario
router.delete('/api/usuarios/:idUsuario', MiddelWares.eliminarUsuario); // Borrar un usuario
router.get('/api/usuario', MiddelWares.obtenerUsuarioPorCorreo); // Obtiene usuario por correo
router.post('/cambiar-contrasena', MiddelWares.LogOut); // Cambia la contraseña del usuario

module.exports = router;
