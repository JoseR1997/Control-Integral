import React, { useState } from 'react';
import Modal from 'react-modal';

const AddClientModal = ({ isOpen, onRequestClose, client, handleInputChange, handleSaveChanges }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!client.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!client.apellidos) newErrors.apellidos = 'Los apellidos son requeridos';
    if (!client.cedula) newErrors.cedula = 'La cédula es requerida';
    if (!client.correo) newErrors.correo = 'El correo electrónico es requerido';
    if (!client.telefono) newErrors.telefono = 'El teléfono es requerido';
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      handleSaveChanges();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      ariaHideApp={false}
      className="flex justify-center items-center h-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Añadir Cliente</h2>
        
        {['nombre', 'apellidos', 'cedula', 'correo', 'telefono'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field === 'correo' ? 'Correo Electrónico' : field}:
            </label>
            <input
              type={field === 'correo' ? 'email' : 'text'}
              name={field}
              value={client[field] || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
            />
            {errors[field] && <span className="text-red-500 text-xs mt-1">{errors[field]}</span>}
          </div>
        ))}

        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={onRequestClose} 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddClientModal;