import React from 'react';
import documents from "../../assets/images/documents.png"

const Documentos = ({ documentos, handleDownload, handleDelete }) => {
  return (
    <>
      <div className="bg-gray-800 text-white p-4 flex justify-between mt-2 rounded-md items-center">
        <h1 className='p-2'>Documentos</h1>
      </div>
      <div className="bg-gray-100 p-4 mt-2">
        <div className='flex flex-row space-x-4'>
          {documentos.map((documento, index) => (
            <div key={index} className='border-2 border-gray-400 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2'>
              <p><span className="font-bold">Título:</span> {documento.nombreDocumento}</p>
              <img src={documents} alt='exampleDocument' className='w-[100px] mt-4'/>
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
    </>
  );
};

export default Documentos;
