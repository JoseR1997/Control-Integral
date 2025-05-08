// src/App.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from '../components/specific/GestionServicios';
import AddServiceModal from '../components/modals/AddServiceModal';

// Componente principal para gestionar servicios
const GestionServicios = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [serviceData, setServiceData] = useState({
    titulo: '',
    descripcion: '',
    detalles: ''
  });

  // Verificar token y redirigir si no está presente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicio de sesión requerido',
        text: 'Debes iniciar sesión para acceder a esta página.',
        confirmButtonText: 'Iniciar sesión'
      }).then(() => {
        navigate('/login'); // Asegúrate de que la ruta a la página de login es correcta
      });
    }
  }, [navigate]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setServiceData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveCase = () => {
    // Lógica para guardar el caso
    console.log('Service saved:', serviceData);
    closeModal();
  };

  const handleRedirect = () => {
    navigate('/Servicios.');
  };

  return (
    <div className="min-h-screen flex flex-col font-inter p-4">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={openModal}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg text-lg hover:bg-green-600 transition"
        >
          Añadir servicios
        </button>
        <button
          onClick={handleRedirect}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg text-lg hover:bg-yellow-600 transition"
        >
          Calcular servicio
        </button>
      </div>

      <AddServiceModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        caseData={serviceData}
        handleInputChange={handleInputChange}
        handleSaveCase={handleSaveCase}
      />

      <div className="bg-gray-200 p-4 mt-4 flex justify-center">
        <DataTable />
      </div>
    </div>
  );
};

export default GestionServicios;
