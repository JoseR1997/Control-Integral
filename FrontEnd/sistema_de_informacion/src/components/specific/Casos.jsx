import React from 'react';

const Casos = ({ casos, handleAddCaseClick, handleViewCaseClick, filter, setFilter }) => {
  return (
    <>

      <div className="bg-gray-800 p-4 flex justify-between mt-2 rounded-md text-white items-center">
        <h1 className='p-2'>Casos</h1>
        <button className='hover:bg-gray-500 p-2 rounded-sm hover:text-white' onClick={handleAddCaseClick}>Agregar Caso</button>
      </div>
      <div className='flex flex-row justify-around items-center mt-2 rounded-md border-2 p-2'>
        <button
          onClick={() => setFilter('activos')}
          className={`px-4 py-2 m-2 border rounded w-full h-full ${filter === 'activos' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black border-gray-300'
            }`}
        >
          Activos
        </button>
        <button
          onClick={() => setFilter('inactivos')}
          className={`px-4 py-2 m-2 border rounded w-full h-full ${filter === 'inactivos' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black border-gray-300'
            }`}
        >
          Archivados
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-md mt-2">
        <div className='flex flex-row space-x-4 gap-2'>
          {casos.map((caso, index) => (
            <div key={index} className='border-2 border-gray-400 p-4 rounded-lg shadow-lg flex items-center'>
              <div className='flex flex-col space-y-2'>
                <p><span className="font-bold">Titulo:</span> {caso.TituloDelCaso}</p>
                <p><span className="font-bold">Fecha:</span> {caso.Creacion}</p>
                <button
                  className='border border-black mt-3 px-3 py-1 bg-gray-300 hover:bg-gray-800 hover:text-white rounded'
                  onClick={() => handleViewCaseClick(caso.IdCaso)}
                >
                  Ver caso
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Casos;
