import React, { useState, useEffect } from 'react';

const Modificaciones = () => {
  const [modificaciones, setModificaciones] = useState([]);

  useEffect(() => {
    const fetchModificaciones = async () => {
      try {
        const response = await fetch('/api/modificaciones-casos');
        const data = await response.json();
        if (data.Issuccessful) {
          setModificaciones(data.Details);
        } else {
          console.error('Error fetching modificaciones:', data.Description);
        }
      } catch (error) {
        console.error('Error fetching modificaciones:', error);
      }
    };

    fetchModificaciones();
  }, []);

  return (
    <div className="p-6 bg-gray-200 h-full">
      <h1 className="text-center text-xl font-bold mb-4">Modificaciones hechas en casos</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Modificaciones hechas en casos</h2>
          <div>
            <button className="bg-gray-500 text-white px-2 py-1 rounded">Filtrar</button>
          </div>
        </div>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">ID de caso</th>
              <th className="border px-4 py-2">Modificación</th>
              <th className="border px-4 py-2">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {modificaciones.map((modificacion, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{modificacion.fechaModificacion}</td>
                <td className="border px-4 py-2">{modificacion.idCaso}</td>
                <td className="border px-4 py-2">{modificacion.descripcion}</td>
                <td className="border px-4 py-2">{modificacion.realizadoPor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Modificaciones;
