// src/App.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from '../components/specific/Servicios';
import AddServiceModal from '../components/modals/AddServiceModal';

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

  return (
    <div className="min-h-screen flex flex-col font-inter p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Calculadora de servicios</h1>

      <div className="bg-gray-200 p-4 rounded-lg shadow-md">
        <div className="mt-4">
          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default GestionServicios;
