import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isToday,
  parse,
  startOfToday,
  isPast,
} from 'date-fns';
import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { getIdAbogado } from '../api/usuarios';
import { decodeToken } from '../utils/utils';
import AddHorarioModal from '../components/modals/AddHorarioModal';
import AddCitaModal from '../components/modals/AddCitaModal';
import HorarioDetailsModal from '../components/modals/HorarioDetailsModal';
import Sidebar from '../components/specific/Sidebar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

Modal.setAppElement('#root');

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [idAbogado, setIdAbogado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [idRol, setIdRol] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const [currentMonth, setCurrentMonth] = useState(format(startOfToday(), 'MMM-yyyy'));
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isHorarioModalOpen: false,
    isAddHorarioModalOpen: false,
    isAddCitaModalOpen: false,
  });
  const [modalDay, setModalDay] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [cita, setCita] = useState(null);
  const [citasDia, setCitasDia] = useState([]);
  const [citasProximosDias, setCitasProximosDias] = useState([]);
  const token = localStorage.getItem('token');
  const [citasCliente, setCitasCliente] = useState([]);

  const updateModalState = useCallback((updates) => {
    setModalState(prevState => ({ ...prevState, ...updates }));
  }, []);

  useEffect(() => {
    async function fetchData() {
      const decoded = decodeToken();
      if (decoded && decoded.usuario) {
        const id = await getIdAbogado(decoded.usuario);
        setIdAbogado(id);
        setUsuario(decoded.usuario);
        setIdRol(decoded.idRol);
        const citas = await fetchCitasCliente(token, id);
        setCitasCliente(citas);
      }
      await fetchCitasProximosDias();
      await fetchCitasDia();
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!modalState.isHorarioModalOpen && !modalState.isModalOpen) {
      fetchHorarios(modalDay);
      fetchCitasDia();
      fetchCitasProximosDias();
    }
  }, [modalState.isHorarioModalOpen, modalState.isModalOpen]);

  const fetchCitasCliente = useCallback(async (token, idCliente) => {
    try {
      
      const response = await fetch('/obtenerCitasCliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Añadimos el token al header
        },
        body: JSON.stringify({
          token,
          idCliente
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.IsSuccessful) {
        return data.Details; 
      } else {
        console.error(data.Description);
        throw new Error(data.Description);
      }
    } catch (error) {
      console.error('Error fetching citas del cliente:', error);
      throw error;
    }
  }, []);

  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [serviceData, setServiceData] = useState({
    titulo: '',
    descripcion: '',
    detalles: ''
  });

  // Verificar token y redirigir si no está presente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicio de sesión requerido',
        text: 'Debes iniciar sesión para acceder a esta página.',
        confirmButtonText: 'Iniciar sesión'
      }).then(() => {
        navigate('/login'); // Asegúrate de que la ruta a la página de login es correcta
      });
    }
  }, [navigate]);

  const openModalCitas = () => setModalIsOpen(true);
  const closeModalCitas = () => setModalIsOpen(false);

  const fetchCitasDia = useCallback(async () => {
    try {
      const response = await fetch('/CitasDia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          fecha: format(startOfToday(), 'yyyy-MM-dd')
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.IsSuccessful) {
        setCitasDia(data.Details);
      } else {
        console.error(data.Description);
      }
    } catch (error) {
      console.error('Error fetching citas del día:', error);
    }
  }, [token]);

  const fetchCitasProximosDias = useCallback(async () => {
    try {
      const response = await fetch('/getCitasProximosDias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.IsSuccessful) {
        setCitasProximosDias(data.Details);
      } else {
        console.error(data.Description);
      }
    } catch (error) {
      console.error('Error fetching citas de los próximos días:', error);
    }
  }, [token]);

  const fetchHorarios = useCallback(async (day) => {
    if (!day) return;
    try {
      const response = await fetch(`/horarios/${format(day, 'yyyy-MM-dd')}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setHorarios(data);
    } catch (error) {
      console.error('Error fetching horarios:', error);
      setHorarios([]);
    }
  }, []);

  const openModal = useCallback((day) => {
    setModalDay(day);
    fetchHorarios(day);
    updateModalState({ isModalOpen: true });
  }, [fetchHorarios, updateModalState]);

  const closeModal = useCallback(() => {
    updateModalState({ isModalOpen: false });
    setModalDay(null);
    setSelectedHorario(null);
    setCita(null);
  }, [updateModalState]);

  const openAddHorarioModal = useCallback(() => {
    updateModalState({ isModalOpen: false, isAddHorarioModalOpen: true });
  }, [updateModalState]);

  const closeAddHorarioModal = useCallback(() => {
    updateModalState({ isAddHorarioModalOpen: false, isModalOpen: true });
    fetchCitasDia();
    fetchHorarios(modalDay);
  }, [updateModalState, fetchCitasDia, fetchHorarios, modalDay]);

  const fetchCita = useCallback(async (horario) => {
    try {
      console.log('Fetching cita for idHorario:', horario.idHorario);
      const response = await fetch(`/citas/${horario.idHorario}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text(); 
      console.log('Raw response:', text);
      
      if (!text) {
        console.log('Response is empty');
        setCita(null);
        return;
      }
      
      try {
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        setCita(data);
        setSelectedHorario({
          ...horario,
          fecha: horario.fecha || data.fecha,
        });
        updateModalState({ isHorarioModalOpen: true });
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        setCita(null);
      }
    } catch (error) {
      console.error('Error fetching cita:', error.message);
      setCita(null);
    }
    setSelectedHorario(horario);
    updateModalState({ isHorarioModalOpen: true });
  }, [updateModalState]);

  const closeHorarioModal = useCallback(() => {
    fetchHorarios(modalDay);
    updateModalState({ isHorarioModalOpen: false });
  }, [updateModalState,fetchHorarios, modalDay]);

  const openAddCitaModal = useCallback(() => {
    updateModalState({ isHorarioModalOpen: false, isAddCitaModalOpen: true });
  }, [updateModalState]);

  const closeAddCitaModal = useCallback(() => {
    updateModalState({ isAddCitaModalOpen: false, isHorarioModalOpen: true });
    fetchCitasProximosDias();
    fetchCita(selectedHorario);
    fetchCitasDia();
  }, [updateModalState, fetchCitasProximosDias, fetchCita, selectedHorario, fetchCitasDia]);

  const agregarCita = useCallback(async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const cita = {
      idCliente: idAbogado,
      nombre: data.get('nombre'),
      apellido: data.get('apellido'),
      telefono: data.get('telefono'),
      idHorario: selectedHorario.idHorario,
      motivoConsulta: data.get('motivoConsulta'),
      idRol,
      token
    };
  
    try {
      const response = await fetch('/crearCita', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cita),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta del servidor:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const responseData = await response.json();
      
      if (!responseData.IsSuccessful) {
        throw new Error(responseData.Description || 'Error desconocido al crear la cita');
      }
  
      console.log('Cita creada con éxito:', responseData);
      await fetchHorarios(modalDay);
      fetchCita(selectedHorario);
      await fetchCitasDia();
      await fetchCitasProximosDias();
      closeAddCitaModal();
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  }, [idAbogado, selectedHorario, idRol, token, fetchHorarios, modalDay, fetchCita, fetchCitasDia, fetchCitasProximosDias, closeAddCitaModal]);

  const cancelarCita = useCallback(async () => {
    console.log('Iniciando cancelación de cita');
    try {
      const response = await fetch(`/cancelarCita`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
          idRol,
          idCita: cita.idCita,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      await fetchHorarios(modalDay);
      setCita(null);
      setSelectedHorario(null);
      updateModalState({ 
        isHorarioModalOpen: false,
        isModalOpen: false
      });
      await fetchCitasDia();
      await fetchCitasProximosDias();
      
      console.log('Cita cancelada con éxito, modales cerrados');
      alert('Cita cancelada con éxito');
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      alert('Error al cancelar la cita. Por favor, inténtelo de nuevo.');
    }
  }, [cita, token, idRol, updateModalState, fetchHorarios, modalDay, fetchCitasDia, fetchCitasProximosDias]);

  const eliminarHorario = useCallback(async (idHorario, token, idRol, e) => {
    e.stopPropagation();
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este horario?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`/cancelarHorario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          idHorario,
          token,
          idRol
        })
      });

      if (response.ok) {
        console.log('Horario eliminado con éxito');
        await fetchHorarios(modalDay);
        fetchCitasDia();
      } else {
        console.error('Error al eliminar el horario');
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  }, [fetchHorarios, modalDay, fetchCitasDia]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  return (
    < >
      <div className="flex flex-col md:flex-row font-inter">
        <Sidebar   fetchCita={fetchCita} citasDia={citasDia} idRol={idRol} citasCliente={citasCliente} citasProximosDias={citasProximosDias} />
        <div className="pt-4 md:pt-4 flex flex-col items-center flex-grow bg-gray-50">

          {idRol === 1 && (
            <div className=' w-full max-w-7xl px-4 mx-auto bg-white shadow-lg font-inter font-bold text-black flex justify-end rounded-md'>
              <a href='/AdminWhatsApp' className='flex items-center justify-center p-2'>Administrar</a>
            </div>
          )}

          <div className="w-full max-w-7xl px-4 mt-4 mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  {format(firstDayCurrentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={previousMonth}
                    className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <span className="sr-only">Previous month</span>
                    <ChevronLeftIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                  <button
                    onClick={nextMonth}
                    type="button"
                    className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <span className="sr-only">Next month</span>
                    <ChevronRightIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 mb-2 text-sm font-semibold text-gray-700">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="hidden sm:flex items-center justify-center h-10 md:h-12 lg:h-14">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      'relative'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDay(day);
                        if (isPast(day) && !isToday(day)) {
                          if (idRol === 1) {
                            openModal(day);
                          }
                        } else {
                          if (idRol === 1 || idRol === 2) {
                            openModal(day);
                          }
                        }
                      }}
                      className={classNames(
                        'w-full h-10 sm:h-10 md:h-12 lg:h-14 flex items-center justify-center rounded-lg text-center transition-all duration-200',
                        isPast(day) && !isToday(day) ? 'bg-red-50 text-red-600' :
                          isToday(day) ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-50 text-gray-900 hover:bg-gray-100',
                        isEqual(day, selectedDay) && 'ring-2 ring-offset-2 ring-indigo-600',
                      )}
                    >
                      <time
                        dateTime={format(day, 'yyyy-MM-dd')}
                        className={classNames(
                          'text-sm sm:text-base font-semibold',
                          isPast(day) && !isToday(day) ? 'text-red-400' : ''
                        )}
                      >
                        {format(day, 'd')}
                      </time>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalState.isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Detalles del Horario"
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
            {modalDay && (
              <div
                className={classNames(
                  'relative p-8 rounded-xl shadow-2xl max-w-md w-full',
                  isPast(modalDay) && !isToday(modalDay)
                    ? 'bg-red-50'
                    : isToday(modalDay)
                      ? 'bg-amber-50'
                      : 'bg-white'
                )}
              >
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Horarios para {format(modalDay, 'MMMM dd, yyyy')}
                </h2>
                {horarios.length > 0 ? (
                  horarios
                    .filter(horario => horario.fecha === format(modalDay, 'yyyy-MM-dd'))
                    .map((horario) => {
                      const inicio = new Date(`1970-01-01T${horario.horarioInicio}:00`);
                      const fin = new Date(`1970-01-01T${horario.horarioFin}:00`);
                      return (
                        <div
                          key={horario.idHorario}
                          className={classNames(
                            'mt-4 p-4 border rounded-lg cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg',
                            horario.disponible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                          )}
                          onClick={() => {if (idRol === 1 || (idRol === 2 && horario.disponible)) {
                            fetchCita(horario);
                          }}}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <time dateTime={inicio.toISOString()} className="text-gray-700 font-medium">
                                {format(inicio, 'h:mm a')}
                              </time>
                              <span className="mx-2 text-gray-400">-</span>
                              <time dateTime={fin.toISOString()} className="text-gray-700 font-medium">
                                {format(fin, 'h:mm a')}
                              </time>
                            </div>
                            {idRol === 1 && (!isPast(modalDay) || isToday(modalDay)) && (
                              <button
                                onClick={(e) => eliminarHorario(horario.idHorario, token, idRol, e)}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-300"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-gray-600 italic mt-4">No hay horarios para este día.</p>
                )}
                {(!isPast(modalDay) || isToday(modalDay)) && (
                  <button
                    onClick={openAddHorarioModal}
                    className="mt-6 w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Agregar Horario
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </Modal>

        <AddHorarioModal
  isOpen={modalState.isAddHorarioModalOpen}
  closeAddHorarioModal={closeAddHorarioModal}
  handleSubmit={fetchHorarios}
  modalDay={modalDay}
  idAbogado={idAbogado}
  token={token}
  idRol={idRol}
/>

<HorarioDetailsModal
  isOpen={modalState.isHorarioModalOpen}
  closeHorarioModal={closeHorarioModal}
  cita={cita}
  selectedHorario={selectedHorario}
  openAddCitaModal={openAddCitaModal}
  cancelarCita={cancelarCita}
  idRol={idRol}
  modalDay={modalDay}
/>

<AddCitaModal
  isOpen={modalState.isAddCitaModalOpen}
  closeAddCitaModal={closeAddCitaModal}
  handleSubmit={agregarCita}
  fetchHorarios={fetchHorarios}
/>
      </div>
    </>
  )
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
