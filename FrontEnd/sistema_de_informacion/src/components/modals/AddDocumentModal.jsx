import React, { useState } from 'react';
import Modal from 'react-modal';

const AddDocumentModal = ({ isOpen, onRequestClose, handleUpload }) => {
  const [file, setFile] = useState(null);
  const [nombreDocumento, setNombreDocumento] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onNameChange = (e) => {
    setNombreDocumento(e.target.value);
  };

  const onSubmit = () => {
    handleUpload(file, nombreDocumento);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false} className="flex justify-center h-full items-center">
      <div className="bg-white p-8 rounded shadow-md w-1/3">
        <h2 className="text-xl mb-4">Agregar Documento</h2>
        <label className="block mb-2">Nombre del Documento:</label>
        <input
          type="text"
          value={nombreDocumento}
          onChange={onNameChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2">Archivo:</label>
        <input
          type="file"
          onChange={onFileChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button onClick={onRequestClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={onSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Subir</button>
        </div>
      </div>
    </Modal>
  );
};

export default AddDocumentModal;
