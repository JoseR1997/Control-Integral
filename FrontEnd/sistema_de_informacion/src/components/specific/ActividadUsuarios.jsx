import React, { useState, useEffect } from 'react';

const ActividadUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('/api/accesos-usuarios');
        const data = await response.json();
        if (data.Issuccessful) {
          setUsuarios(data.Details);
        } else {
          console.error('Error fetching usuarios:', data.Description);
        }
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="p-6 bg-gray-200 h-full">
      <h1 className="text-center text-xl font-bold mb-4">Usuarios que han iniciado sesión</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Usuarios que han iniciado sesión</h2>
          <div>
            <button className="bg-gray-500 text-white px-2 py-1 rounded">Filtrar</button>
          </div>
        </div>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Hora</th>
              <th className="border px-4 py-2">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{new Date(usuario.fechaHoraAcceso).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(usuario.fechaHoraAcceso).toLocaleTimeString()}</td>
                <td className="border px-4 py-2">{usuario.idUsuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActividadUsuarios;
