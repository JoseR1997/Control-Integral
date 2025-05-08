import React, { useState } from 'react';
import { actualizaEstadoCaso } from '../../api/casos';

const Caso = ({ caso, handleDeleteCase, handleViewDocuments, handleEstadoChange }) => {
    const [isHovered, setIsHovered] = useState(false);

    const toggleEstado = async () => {
        const nuevoEstado = caso.idEstado === 1 ? 2 : 1;
        const updatedCase = await actualizaEstadoCaso(caso.idCaso, nuevoEstado);
        if (updatedCase) {
            handleEstadoChange(caso.idCaso, nuevoEstado);
        }
    };

    return (
        <>
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center mt-2 rounded-md ">
                <h1 className='p-2'>{caso.titulo}</h1>
                <button
                    className={`flex items-center justify-center p-2 rounded ${caso.idEstado === 1
                        ? 'bg-green-500 hover:bg-red-500'
                        : 'bg-red-500 hover:bg-green-500'
                        } transition-colors duration-500`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={toggleEstado}
                >
                    {isHovered
                        ? (caso.idEstado === 1 ? 'Archivar' : 'Activar')
                        : (caso.idEstado === 1 ? 'Activo' : 'Archivado')}
                </button>
            </div>
            <div className='bg-gray-200 p-4 mt-4 rounded-lg'>
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1 space-y-4">
                            <div className="group">
                                <div className="text-sm font-medium text-gray-500 mb-1">Id del Caso</div>
                                <div className="text-base text-gray-800 font-semibold">{caso.idCaso}</div>
                            </div>
                            <div className="group">
                                <div className="text-sm font-medium text-gray-500 mb-1">Descripción</div>
                                <p className="text-base text-gray-800">{caso.descripcion}</p>
                            </div>
                            <div className="group">
                                <div className="text-sm font-medium text-gray-500 mb-1">Detalles</div>
                                <p className="text-base text-gray-800">{caso.detalles}</p>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4 md:w-48 mt-4 md:mt-0 md:ml-6">
                            <button
                                className="flex items-center justify-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-indigo-900 transition duration-300 ease-in-out"
                                onClick={() => handleViewDocuments(caso.idCaso)}
                            >
                                <span role="img" aria-label="documents">📄</span>
                                <span>Documentos</span>
                            </button>
                            <button
                                className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                                onClick={() => handleDeleteCase(caso.idCaso)}
                            >
                                <span role="img" aria-label="delete">🗑️</span>
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Caso;
