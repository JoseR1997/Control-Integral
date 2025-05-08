import React from 'react';

const NuevosClientes = () => {
  return (
    <div className='font-inter text-sm'>
      <h1 className='text-2xl mb-5'>Casos recientes</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {[1, 2,3,4].map((index) => (
          <div key={index} className='bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex flex-col space-y-2'>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Nuevo Cliente</p>
              <p><span className="font-medium text-gray-700">Nombre:</span> <span className="text-gray-600">Nombre del cliente</span></p>
              <p><span className="font-medium text-gray-700">Fecha:</span> <span className="text-gray-600">Fecha del caso</span></p>
              <button className='mt-3 px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-indigo-700 transition-colors duration-300 uppercase tracking-wider'>
                Ver cliente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NuevosClientes;