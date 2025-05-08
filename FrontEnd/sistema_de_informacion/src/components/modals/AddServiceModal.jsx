import React from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { NumericFormat } from 'react-number-format';

const API_URL = 'http://localhost:5000';

var Token = localStorage.getItem('token');

const AddCaseModal = ({ isOpen, onRequestClose, caseData, handleInputChange }) => {
  // El token debería obtenerse de un lugar seguro, como un contexto o un hook
  const token = Token;
  const handleSave = async () => {
    // Validar que todos los campos estén completos
    if (!caseData.titulo || !caseData.descripcion || !caseData.precio) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/guardarServicio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          nombreServicio: caseData.titulo,
          descripcion: caseData.descripcion,
          precioBase: parseFloat(caseData.precio.replace(/₡/g, '').replace(/,/g, '')), // Eliminar símbolos y comas antes de enviar
        }),
      });

      const result = await response.json();

      if (result.IsSuccessful) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Servicio guardado con exito',
        }).then(() => {
          onRequestClose(); // Cerrar el modal si la solicitud fue exitosa
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al guardar el servicio.',
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false} className="flex justify-center h-full items-center">
      <div className="bg-white p-8 rounded shadow-md w-1/3">
        <h2 className="text-xl mb-4">Añadir Nuevo Servicio</h2>
        <label className="block mb-2">Nombre del servicio:</label>
        <input
          type="text"
          name="titulo"
          value={caseData.titulo || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <label className="block mb-2">Descripción:</label>
        <textarea
          name="descripcion"
          value={caseData.descripcion || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <label className="block mb-2">Precio Base:</label>
        <NumericFormat
          name="precio"
          value={caseData.precio || ''}
          onValueChange={(values) => handleInputChange({
            target: {
              name: 'precio',
              value: values.value
            }
          })}
          thousandSeparator=","
          prefix="₡"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <div className="flex justify-end space-x-4">
          <button onClick={onRequestClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCaseModal;
