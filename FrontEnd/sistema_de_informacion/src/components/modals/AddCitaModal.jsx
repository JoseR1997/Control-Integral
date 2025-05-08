import React from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

function AddCitaModal({ isOpen, closeAddCitaModal, handleSubmit, fetchHorarios }) {
  return (
<Modal
  isOpen={isOpen}
  onRequestClose={closeAddCitaModal}
  contentLabel="Agregar Cita"
  className="post-it-modal"
  overlayClassName="post-it-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
>
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md"
  >
    <div className="relative p-8 rounded-xl shadow-2xl bg-white">
      <button onClick={closeAddCitaModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Cita</h2>
      <form
        className="space-y-6"
        onSubmit={async (e) => {
          await handleSubmit(e);
          await fetchHorarios(new Date());
          closeAddCitaModal();
        }}
      >
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            name="apellido"
            id="apellido"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            id="telefono"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="motivoConsulta" className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de Consulta
          </label>
          <textarea
            name="motivoConsulta"
            id="motivoConsulta"
            rows="3"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
        >
          Guardar
        </button>
      </form>
    </div>
  </motion.div>
</Modal>
  );
}

export default AddCitaModal;
