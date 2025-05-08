import React, { useCallback } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { isPast, parseISO, isToday } from 'date-fns';

function HorarioDetailsModal({ isOpen, closeHorarioModal, cita, idRol, selectedHorario, openAddCitaModal, cancelarCita }) {
  const isPastOrTodayDate = selectedHorario ?
    (!isPast(parseISO(selectedHorario.fecha)) || isToday(parseISO(selectedHorario.fecha))) :
    false;

  const handleCancelarCita = useCallback(async () => {
    await cancelarCita();
    closeHorarioModal();
  }, [cancelarCita, closeHorarioModal]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeHorarioModal}
      contentLabel="Detalles de la Cita"
      className="post-it-modal"
      overlayClassName="post-it-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {selectedHorario && (
          <div className="relative p-8 rounded-xl shadow-2xl bg-white">
            <button onClick={closeHorarioModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Detalles de la Cita
            </h2>
            {cita ? (
              <div className="mt-4 border border-gray-200 p-6 rounded-lg bg-gray-50 shadow-inner">
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Cita programada con {cita.nombre} {cita.apellido}
                </p>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Razón de la cita: {cita.motivoConsulta}
                  </p>
                  <p className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Número del cliente: {cita.telefono}
                  </p>
                </div>
                {isPastOrTodayDate && (
                  <button
                    onClick={handleCancelarCita}
                    className="mt-6 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Cancelar Cita
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 text-center">
                {idRol === 1 && (
                  <p className="text-lg text-gray-600 mb-6">No hay cita programada para este horario.</p>
                )}
                {idRol === 2 && (
                  <p className="text-lg text-gray-600 mb-6">Disponible para agendar una cita.</p>
                )}
                {isPastOrTodayDate && (
                  <button
                    onClick={openAddCitaModal}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Agregar Cita
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Modal>
  );
}

export default HorarioDetailsModal;