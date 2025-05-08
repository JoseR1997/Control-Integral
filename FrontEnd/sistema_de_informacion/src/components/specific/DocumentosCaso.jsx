import React, { useState } from 'react';
import AddDocumentModal from '../modals/AddDocumentModal'; 
import documents from "../../assets/images/documents.png"

const DocumentosCaso = ({ documentos, handleDownload, handleDelete, handleUpload }) => {
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);

  const openAddDocumentModal = () => {
    setIsAddDocumentModalOpen(true);
  };

  const closeAddDocumentModal = () => {
    setIsAddDocumentModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-800 text-white p-4 flex mt-2 rounded-md justify-between items-center">
        <h1 className='p-2'>Documentos</h1>
        <button className='hover:bg-gray-100 p-2 rounded-sm hover:text-gray-900' onClick={openAddDocumentModal}>Agregar Documento</button>
      </div>
      <div className="bg-gray-100 p-4 mt-2">
        <div className='flex flex-row space-x-4'>
          {documentos.map((documento, index) => (
            <div key={index} className='border-2 border-gray-400 p-4 rounded-lg shadow-lg flex items-center flex-col space-y-2'>
              <p><span className="font-bold">Título:</span> {documento.nombreDocumento}</p>
              <img src={documents} className='w-[100px] mt-4'/>
              <p><span className="font-bold">Fecha:</span> {documento.fechaSubida}</p>
              <button onClick={() => handleDownload(documento.idDocumento)} className='border-1 border-black mt-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded'>
                Descargar Documento
              </button>
              <button onClick={() => handleDelete(documento.idDocumento)} className='border-1 border-black mt-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded'>
                Eliminar Documento
              </button>
            </div>
          ))}
        </div>
      </div>
      <AddDocumentModal
        isOpen={isAddDocumentModalOpen}
        onRequestClose={closeAddDocumentModal}
        handleUpload={handleUpload}
      />
    </>
  );
};

export default DocumentosCaso;
