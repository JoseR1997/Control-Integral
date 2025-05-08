import React from 'react';
import Modal from 'react-modal';

const EditClientModal = ({ isOpen, onRequestClose, client, handleInputChange, handleSaveChanges }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false} className="flex justify-center h-full items-center">
      <div className="bg-white p-8 rounded shadow-md w-1/3">
        <h2 className="text-xl mb-4">Editar Cliente</h2>
        <label className="block mb-2">Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={client.nombre}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2">Apellidos:</label>
        <input
          type="text"
          name="apellidos"
          value={client.apellidos}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2">Cédula:</label>
        <input
          type="text"
          name="cedula"
          value={client.cedula}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2">Correo Electrónico:</label>
        <input
          type="email"
          name="correo"
          value={client.correo}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2">Teléfono:</label>
        <input
          type="text"
          name="telefono"
          value={client.telefono}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2">Contraseña:</label>
        <input
          type="password"
          name="password"
          value={client.password}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button onClick={onRequestClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditClientModal;
