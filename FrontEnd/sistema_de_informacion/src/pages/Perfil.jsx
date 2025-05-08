import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchCasosPorCliente } from '../api/casos';
import { descargarDocumento, fetchDocumentosCaso } from '../api/documentos';
import documents from "../assets/images/documents.png";

const Perfil = () => {
  const [usuario, setUsuario] = useState({});
  const [casos, setCasos] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const getTokenInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      const decodedToken = getTokenInfo();
      if (!decodedToken) {
        console.error('Token no válido');
        return;
      }
      const correo = decodedToken.usuario;

      try {
        const response = await fetch(`http://localhost:5000/api/usuario?correo=${correo}`);
        const data = await response.json();
        setUsuario(data);
        const casosData = await fetchCasosPorCliente(data.idUsuario);
        console.log("Casos obtenidos:", casosData);
        setCasos(casosData);
      } catch (error) {
        console.error('Error fetching usuario:', error);
      }
    };

    fetchUsuario();
  }, []);

  const handleVerCasoClick = async (caso) => {
    setSelectedCase(caso);
    const documentosData = await fetchDocumentosCaso(caso.IdCaso);
    setDocumentos(documentosData);
  };

  const handleDownload = async (idDocumento) => {
    try {
      await descargarDocumento(idDocumento);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleContrasenaChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/cambiar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario: usuario.correo, contrasenaActual, nuevaContrasena }),
      });

      const result = await response.json();
      setMensaje(result.Description);
    } catch (error) {
      setMensaje('Error al cambiar la contraseña. Intente de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <section className="bg-gray-200 h-auto flex justify-between">
        <nav>
          <ul className="flex ">
            <div className='w-[225px] border-r-2 p-4 border-customLightGray h-full flex justify-center items-center'>
              <li className="font-semibold">Casos</li>
            </div>
          </ul>
        </nav>
      </section>
      <div className="flex flex-1">
        <aside className="bg-gray-100 w-1/6 p-4">
          {casos.map((caso) => (
            <div key={caso.IdCaso} className="flex items-center  bg-white justify-between p-2 shadow-lg mt-2 rounded-md border-gray-400 ">
              <span>{caso.TituloDelCaso}</span>
              <button onClick={() => handleVerCasoClick(caso)} className="shadow-lg  mt-3 px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded">
                Ver caso
              </button>
            </div>
          ))}
        </aside>
        <div className="flex-1 p-4">
          <div className="bg-gray-800 p-4 flex justify-between items-center rounded-md text-white">
            <div className="text-xl font-semibold">Mi información</div>
          </div>
          <div className="bg-gray-200 rounded-md shadow-lg p-4 mt-2">
            <div className="flex items-center mb-4">
              <div className="bg-gray-500 w-24 h-24 rounded-full flex justify-center items-center">
                <span role="img" aria-label="user" className="text-white text-4xl">👤</span>
              </div>
              <div className="ml-4">
                <div className="text-xl">{usuario.nombre} {usuario.apellidos}</div>
                <div className="flex space-x-4 mt-2">
                  <button className="flex items-center space-x-1" onClick={() => setIsModalOpen(true)}>
                    <span role="img" aria-label="edit">✏️</span>
                    <span>Cambiar Contraseña</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="bg-white p-8 mt-6 rounded-lg shadow-lg border border-gray-200">
              <h2 class="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">Información General</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">ID</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{usuario.idUsuario}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Nombre</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{usuario.nombre}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Apellidos</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{usuario.apellidos}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Cédula</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{usuario.cedula}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Correo Electrónico</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{usuario.correo}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600"># Teléfono</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{usuario.telefono}</div>
                </div>
              </div>
            </div>
          </div>
          {selectedCase && (
            <>
              <div className="bg-gray-800 p-4 flex justify-between items-center rounded-md mt-4 text-white">
                <div className="text-xl font-semibold">{selectedCase.TituloDelCaso}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCase.EstadoDelCaso === 1 ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                  {selectedCase.EstadoDelCaso === 1 ? 'Activo' : 'Archivado'}
                </span>
              </div>
              <div className="bg-gray-200 p-4 mt-4 rounded-lg shadow-lg border ">
                <div className='bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">Detalles del Caso</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <div className="text-sm font-medium text-gray-500 mb-1">Descripción</div>
                      <div className="text-base text-gray-800">{selectedCase.DescripcionDelCaso}</div>
                    </div>
                    <div className="group">
                      <div className="text-sm font-medium text-gray-500 mb-1">Abogado</div>
                      <div className="text-base text-gray-800">{selectedCase.NombreAbogado} {selectedCase.ApellidosAbogado}</div>
                    </div>
                    <div className="group">
                      <div className="text-sm font-medium text-gray-500 mb-1">Creación</div>
                      <div className="text-base text-gray-800">{selectedCase.Creacion}</div>
                    </div>
                    <div className="group">
                      <div className="text-sm font-medium text-gray-500 mb-1">Última Modificación</div>
                      <div className="text-base text-gray-800">{selectedCase.Modificacion}</div>
                    </div>
                    <div className="group col-span-2">
                      <div className="text-sm font-medium text-gray-500 mb-1">Detalles</div>
                      <div className="text-base text-gray-800">{selectedCase.Detalles}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Documentos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {documentos.map((documento) => (
                      <div key={documento.idDocumento} className="bg-gray-100 rounded-lg p-4 shadow-md">
                        <img src={documents} className="w-16 h-16 mx-auto mb-4" alt="Documento" />
                        <h4 className="font-bold text-center mb-2 text-gray-800">{documento.nombreDocumento}</h4>
                        <p className="text-sm text-gray-600 text-center mb-4">{documento.fechaSubida}</p>
                        <button
                          onClick={() => handleDownload(documento.idDocumento)}
                          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
                        >
                          Descargar Documento
                        </button>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </>
          )}
            </div>
        </div>

        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false} className="flex justify-center h-full items-center">
          <div className="bg-white p-8 rounded shadow-md w-1/3">
            <h2 className="text-xl mb-4">Cambiar Contraseña</h2>
            {mensaje && <p className="mb-4">{mensaje}</p>}
            <form onSubmit={handleContrasenaChange}>
              <div className="mb-4">
                <label htmlFor="contrasenaActual" className="block text-sm font-medium mb-2">Contraseña Actual</label>
                <input
                  type="password"
                  id="contrasenaActual"
                  name="contrasenaActual"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nuevaContrasena" className="block text-sm font-medium mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  id="nuevaContrasena"
                  name="nuevaContrasena"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Cambiar Contraseña</button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
      );
};

      export default Perfil;
