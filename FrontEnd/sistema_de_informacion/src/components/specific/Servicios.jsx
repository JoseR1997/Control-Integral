import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

// Función para formatear los precios en colones costarricenses
const formatPrice = (price) => {
  return `₡${price.toLocaleString('es-CR')}`;
};
var Token = localStorage.getItem('token');

const API_URL = 'http://localhost:5000';


const DataTable = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const servicesPerPage = 5;
  const [token, setToken] = useState(Token); // Token guardado en el estado

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

  const handleEdit = (id) => {
    alert(`Editar servicio con ID: ${id}`);
  };

  const handleDelete = (id) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelect = (service) => {
    setSelectedServices((prevSelected) => {
      const isSelected = prevSelected.some(s => s.id === service.id);
      if (isSelected) {
        return prevSelected.filter(s => s.id !== service.id);
      } else {
        return [...prevSelected, service];
      }
    });
  };

  const totalSelectedPrice = selectedServices.reduce((acc, service) => acc + service.basePrice, 0);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 pr-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          
          {filteredServices.length === 0 ? (
            <p className="text-center text-gray-800">No se encontraron resultados</p>
          ) : (
            <>
              <table className="w-full border border-gray-300 mt-4">
                <thead className="bg-gray-200 border-b">
                  <tr>
                    <th className="p-2 text-left">Seleccionar</th>
                    <th className="p-2 text-left">Nombre de Servicio</th>
                    <th className="p-2 text-left">Descripción</th>
                    <th className="p-2 text-left">Precio Base</th>
                  </tr>
                </thead>
                <tbody>
                  {currentServices.map(service => (
                    <tr key={service.id} className="border-b">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedServices.some(s => s.id === service.id)}
                          onChange={() => handleSelect(service)}
                          className="form-checkbox"
                        />
                      </td>
                      <td className="p-2">{service.name}</td>
                      <td className="p-2">{service.description}</td>
                      <td className="p-2">{formatPrice(service.basePrice)}</td>
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
                          className={`px-4 py-2 border rounded-md ${number + 1 === currentPage ? 'bg-gray-900 text-white' : 'bg-white bg-gray-800'}`}
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
        </div>

        <div className="w-full md:w-1/2 pl-4 mt-4 md:mt-0">
          <div className="border-l-2 border-gray-300 pl-4">
            <h4 className="text-xl font-semibold">Servicios Seleccionados</h4>
            <ul className="list-disc pl-4 mt-2">
              {selectedServices.map(service => (
                <li key={service.id} className="py-1">
                  {service.name} - {formatPrice(service.basePrice)}
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <h5 className="text-lg font-semibold">Total: {formatPrice(totalSelectedPrice)}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
