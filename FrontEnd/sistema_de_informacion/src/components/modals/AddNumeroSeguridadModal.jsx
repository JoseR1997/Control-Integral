import React, { useState } from 'react';
import Modal from 'react-modal';

const AddNumeroSeguridadModal = ({ isOpen, onRequestClose, handleSaveChanges }) => {
  const [securityNumber, setSecurityNumber] = useState({
    numeroSeguridad: '',
    codigoBoleta: '',
    tipo: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSecurityNumber(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!securityNumber.numeroSeguridad) newErrors.numeroSeguridad = 'El número de seguridad es requerido';
    if (!securityNumber.codigoBoleta) newErrors.codigoBoleta = 'El código de boleta es requerido';
    if (!securityNumber.tipo) newErrors.tipo = 'El tipo es requerido';
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      handleSaveChanges({
        numeroSeguridad: securityNumber.numeroSeguridad,
        codigoBoleta: securityNumber.codigoBoleta,
        tipo: securityNumber.tipo
      });
      setSecurityNumber({ numeroSeguridad: '', codigoBoleta: '', tipo: '' });
      onRequestClose();
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
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Añadir Número de Seguridad</h2>
       
        {['numeroSeguridad', 'codigoBoleta', 'tipo'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}:
            </label>
            <input
              type="text"
              name={field}
              value={securityNumber[field]}
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

export default AddNumeroSeguridadModal;