// src/components/specific/Servicios.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import 'tailwindcss/tailwind.css';
import EditServiceModal from '../modals/EditServiceModal'; // Importar el modal

// Función para formatear los precios en colones costarricenses
const formatPrice = (price) => {
  return `₡${price.toLocaleString('es-CR')}`;
};

const API_URL = 'http://localhost:5000';

const DataTable = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;
  const [token, setToken] = useState(localStorage.getItem('token')); // Token guardado en el estado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [currentService, setCurrentService] = useState(null); // Estado para el servicio actual

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.post(`${API_URL}/obtenerServicios`, {
          token: token
        });
        
        if (response.data.IsSuccessful) {
          const servicesData = response.data.Details.map(service => ({
            id: service.idServicio,
            name: service.nombreServicio,
            description: service.descripcion,
            basePrice: service.precioBase
          }));
          setServices(servicesData);
        } else {
          console.error('Error fetching services:', response.data.Description);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [token]);

  // Filtrar servicios por nombre
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Está seguro que desea eliminar el servicio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const response = await axios.post(`${API_URL}/eliminarServicio`, {
          token: token,
          idServicio: id
        });

        if (response.data.IsSuccessful) {
          const updatedServices = services.filter(service => service.id !== id);
          setServices(updatedServices);
          Swal.fire(
            'Eliminado!',
            'El servicio ha sido eliminado.',
            'success'
          );
        } else {
          Swal.fire(
            'Error!',
            `No se pudo eliminar el servicio: ${response.data.Description}`,
            'error'
          );
        }
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        'Hubo un problema al eliminar el servicio.',
        'error'
      );
      console.error('Error deleting service:', error);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />

      {filteredServices.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron resultados</p>
      ) : (
        <>
          <table className="w-full border border-gray-300 mt-4">
            <thead className="bg-gray-200 border-b">
              <tr>
                {/* La columna ID de Servicio está oculta */}
                <th className="p-2 text-left sr-only">ID de Servicio</th>
                <th className="p-2 text-left">Nombre de Servicio</th>
                <th className="p-2 text-left">Descripción</th>
                <th className="p-2 text-left">Precio Base</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentServices.map(service => (
                <tr key={service.id} className="border-b">
                  {/* La columna ID de Servicio está oculta */}
                  <td className="p-2 sr-only">{service.id}</td>
                  <td className="p-2">{service.name}</td>
                  <td className="p-2">{service.description}</td>
                  <td className="p-2">{formatPrice(service.basePrice)}</td>
                  <td className="p-2 flex space-x-2">
                    <button
                      className="text-gray-900 hover:text-gray-700"
                      onClick={() => handleEdit(service)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-gray-900 hover:text-gray-700"
                      onClick={() => handleDelete(service.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <nav>
              <ul className="flex space-x-1">
                {[...Array(totalPages).keys()].map(number => (
                  <li key={number + 1}>
                    <button
                      className={`px-4 py-2 border rounded-md ${number + 1 === currentPage ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                      onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}

      {isModalOpen && (
        <EditServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={currentService}
        />
      )}
    </div>
  );
};

export default DataTable;
