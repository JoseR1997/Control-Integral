import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { NumericFormat } from 'react-number-format';
const API_URL = 'http://localhost:5000';
var Token = localStorage.getItem('token');

const EditServiceModal = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    id: '',
    nombreServicio: '',
    descripcion: '',
    precioBase: ''
  });

  useEffect(() => {
    if (service) {
      setFormData({
        id: service.id,
        nombreServicio: service.name,
        descripcion: service.description,
        precioBase: service.basePrice.toLocaleString('es-CR')
      });
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.nombreServicio || !formData.descripcion || !formData.precioBase) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/actualizarServicio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: Token,
          idServicio: formData.id,
          nombreServicio: formData.nombreServicio,
          descripcion: formData.descripcion,
          precioBase: parseFloat(formData.precioBase.replace(/₡/g, '').replace(/,/g, '')), // Eliminar símbolos y comas antes de enviar
        }),
      });

      const result = await response.json();

      if (result.IsSuccessful) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Servicio actualizado con exito.',
        }).then(() => {
          onClose(); 
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el servicio.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema con la solicitud.',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} className="flex justify-center h-full items-center">
      <div className="bg-white p-8 rounded shadow-md w-1/3">
        <h2 className="text-xl mb-4">Editar Servicio</h2>
        <label className="block mb-2">Nombre del servicio:</label>
        <input
          type="text"
          name="nombreServicio"
          value={formData.nombreServicio || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <label className="block mb-2">Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <label className="block mb-2">Precio Base:</label>
        <NumericFormat
          name="precioBase"
          value={formData.precioBase || ''}
          onValueChange={(values) => handleInputChange({
            target: {
              name: 'precioBase',
              value: values.value
            }
          })}
          thousandSeparator=","
          prefix="₡"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditServiceModal;
