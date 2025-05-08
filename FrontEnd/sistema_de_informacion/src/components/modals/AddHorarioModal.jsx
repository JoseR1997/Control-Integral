import React from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

function AddHorarioModal({ isOpen, closeAddHorarioModal, handleSubmit, modalDay, idAbogado, token, idRol }) {
  return (
<Modal
  isOpen={isOpen}
  onRequestClose={closeAddHorarioModal}
  contentLabel="Agregar Horario"
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
      <button onClick={closeAddHorarioModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Horario</h2>
      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target;
          const data = new FormData(form);
          const horario = {
            fecha: data.get('fecha'),
            horarioInicio: data.get('horarioInicio'),
            horarioFin: data.get('horarioFin'),
            idAbogado: idAbogado,
            disponible: 1,
            token,
            idRol
          };
          console.log("Enviando horario: ", horario);
          const response = await fetch('/crearHorario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(horario),
          });
          if (response.ok) {
            console.log("Horario creado con éxito");
            handleSubmit(new Date(horario.fecha));
          } else {
            console.log("Error al crear el horario");
          }
          form.reset();
          closeAddHorarioModal();
        }}
      >
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            id="fecha"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
            readOnly
            value={modalDay ? format(modalDay, 'yyyy-MM-dd') : ''}
          />
        </div>
        <div>
          <label htmlFor="horarioInicio" className="block text-sm font-medium text-gray-700 mb-1">
            Horario Inicio
          </label>
          <input
            type="time"
            name="horarioInicio"
            id="horarioInicio"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="horarioFin" className="block text-sm font-medium text-gray-700 mb-1">
            Horario Fin
          </label>
          <input
            type="time"
            name="horarioFin"
            id="horarioFin"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
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

export default AddHorarioModal;
