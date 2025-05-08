import React from 'react';
import { format, parseISO, isAfter,isSameDay, startOfToday } from 'date-fns';


const Sidebar = ({ fetchCita , citasDia = [], citasProximosDias = [], idRol, citasCliente = [] }) => {
  const today = startOfToday();
  const isSameOrAfter = (date, dateToCompare) => {
    return isSameDay(date, dateToCompare) || isAfter(date, dateToCompare);
  };
  
  return (
    <>
      <div className="w-72 p-6 font-inter bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto shadow-lg">
        {idRol === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Citas del Día
            </h2>
            {citasDia.length > 0 ? (
              citasDia.map((cita, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <p className="font-semibold text-lg text-gray-800 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {cita.nombre} {cita.apellido}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {cita.telefono}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {cita.horarioInicio} - {cita.horarioFin}
                  </p>
                  <p className="text-gray-700 mt-2 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Motivo: {cita.motivoConsulta}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">No hay citas para hoy.</p>
            )}
            <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-800 border-b pb-2 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Citas Próximos 5 Días
            </h2>
            {citasProximosDias.length > 0 ? (
              citasProximosDias.map((cita, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <p className="font-semibold text-lg text-gray-800 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {cita.nombre} {cita.apellido}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {cita.telefono}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {format(parseISO(cita.fecha), 'MMM dd')}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {cita.horarioInicio} - {cita.horarioFin}
                  </p>
                  <p className="text-gray-700 mt-2 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Motivo: {cita.motivoConsulta}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">
                No hay citas para los próximos 5 días.
              </p>
            )}
          </>
        )}
        {idRol === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Mis citas
            </h2>
            {citasCliente.length > 0 ? (
              citasCliente
              .filter(cita => isSameOrAfter(parseISO(cita.fecha), today))
              .map((cita, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  onClick={() => { 
                    if (typeof fetchCita === 'function') {
                      fetchCita({
                        idHorario: cita.idHorario,
                        fecha: cita.fecha,
                        horarioInicio: cita.horarioInicio,
                        horarioFin: cita.horarioFin
                      });
                    } else {
                      console.error('fetchCita is not a function');
                    }
                  }}
                >
                  <p className="font-semibold text-lg text-gray-800 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {cita.nombre} {cita.apellido}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {cita.telefono}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {format(parseISO(cita.fecha), 'MMM dd')}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {cita.horarioInicio} - {cita.horarioFin}
                  </p>
                  <p className="text-gray-700 mt-2 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Motivo: {cita.motivoConsulta}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">
                No hay citas para los próximos 5 días.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
