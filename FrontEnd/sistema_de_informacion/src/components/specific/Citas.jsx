import React, { useState, useEffect } from 'react';

const Citas = () => {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await fetch('/api/citas-agendadas');
        const data = await response.json();
        if (data.Issuccessful) {
          setCitas(data.Details);
        } else {
          console.error('Error fetching citas:', data.Description);
        }
      } catch (error) {
        console.error('Error fetching citas:', error);
      }
    };

    fetchCitas();
  }, []);

  return (
    <div className="p-6 bg-gray-200 h-full">
      <h1 className="text-center text-xl font-bold mb-4">Citas</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Citas</h2>
          <div>
            <button className="bg-gray-500 text-white px-2 py-1 rounded">Filtrar</button>
          </div>
        </div>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Hora</th>
              <th className="border px-4 py-2">Servicio</th>
              <th className="border px-4 py-2">Cliente</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{new Date(cita.fechaHora).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(cita.fechaHora).toLocaleTimeString()}</td>
                <td className="border px-4 py-2">{cita.motivoConsulta}</td>
                <td className="border px-4 py-2">{cita.nombre} {cita.apellido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Citas;
