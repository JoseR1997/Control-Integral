import React, { useState, useEffect } from 'react';
import AddSecurityNumberModal from '../modals/AddNumeroSeguridadModal';
import { getIdAbogado } from '../../api/usuarios';
import { decodeToken } from '../../utils/utils';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CasosYNumerosDeSeguridad = () => {
  const [idAbogado, setIdAbogado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [idRol, setIdRol] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [casos, setCasos] = useState({ casosCreados: 0, casosArchivados: 0 });
  const [numerosSeguridad, setNumerosSeguridad] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const decoded = decodeToken();
      if (decoded && decoded.usuario) {
        const id = await getIdAbogado(decoded.usuario);
        setIdAbogado(id);
        setUsuario(decoded.usuario);
        setIdRol(decoded.idRol);
      }
      await fetchCasos();
      await fetchNumerosSeguridad();
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const fetchCasos = async () => {
    try {
      const response = await fetch('/api/informe-casos');
      const data = await response.json();
      setCasos(data.Details);
    } catch (error) {
      console.error('Error fetching casos:', error);
    }
  };

  const fetchNumerosSeguridad = async () => {
    try {
      const response = await fetch('/api/numeros-seguridad', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.IsSuccessful) {
        setNumerosSeguridad(data.Details);
      } else {
        console.error('Error fetching numeros de seguridad:', data.Description);
      }
    } catch (error) {
      console.error('Error fetching numeros de seguridad:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSecurityNumber = async (securityNumber) => {
    try {
      const response = await fetch('/api/numeros-seguridad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          idRol: idRol,
          idUsuario: idAbogado,
          ...securityNumber
        }),
      });
  
      const data = await response.json();
  
      if (data.IsSuccessful) {
        await fetchNumerosSeguridad();
        handleCloseModal();
        alert(data.Description);
      } else {
        console.error('Error al guardar el número de seguridad:', data.Description);
        alert(`Error: ${data.Description}`);
      }
    } catch (error) {
      console.error('Error al guardar el número de seguridad:', error);
      alert('Error al guardar el número de seguridad. Por favor, intente de nuevo.');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6 bg-gray-200 h-full">
      <h1 className="text-center text-xl font-bold mb-4">Casos y números de seguridad</h1>
      <div className="grid grid-cols-2 gap-4 mt-[100px]">
        {/* Tabla 1: Casos creados y archivados */}
        <div className="bg-white p-4 rounded mx-10 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Casos creados y archivados</h2>
            <div>
             
              <button className="bg-gray-500 text-white px-2 py-1 rounded">Ver casos</button>
            </div>
          </div>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="border px-4 py-2">Creados</th>
                <th className="border px-4 py-2">Archivados</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 text-4xl">{casos.casosCreados}</td>
                <td className="border px-4 py-2 text-4xl">{casos.casosArchivados}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Tabla 2: Código de boleta y número de seguridad */}
        <div className="bg-white p-4 rounded mx-10 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Código de boleta y número de seguridad</h2>
            <div>
              
              <button 
                className="bg-gray-500 text-white px-2 py-1 rounded"
                onClick={handleOpenModal}
              >
                Añadir
              </button>
            </div>
          </div>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="border px-4 py-2">Código de boleta</th>
                <th className="border px-4 py-2">Número de seguridad</th>
              </tr>
            </thead>
            <tbody>
              {numerosSeguridad.map((num, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{num.codigoBoleta}</td>
                  <td className="border px-4 py-2">{num.numeroSeguridad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddSecurityNumberModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        handleSaveChanges={handleSaveSecurityNumber}
      />
    </div>
  );
};

export default CasosYNumerosDeSeguridad;