import React, { useState, useEffect } from 'react';
import { useClients } from '../hooks/useClients';
import { useCases } from '../hooks/useCases';
import { useDocuments } from '../hooks/useDocuments';
import EditClientModal from '../components/modals/EditClientModal';
import AddClientModal from '../components/modals/AddClientModal';
import AddCaseModal from '../components/modals/AddCaseModal';
import Casos from '../components/specific/Casos';
import Caso from '../components/specific/Caso';
import Documentos from '../components/specific/Documentos';
import DocumentosCaso from '../components/specific/DocumentosCaso';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Clientes = () => {
  const { clients, selectedClient, setSelectedClient, handleAddClient, handleUpdateClient, handleDeleteClient, getClients } = useClients();
  const [showDocuments, setShowDocuments] = useState(false);
  const [showCaseDocuments, setShowCaseDocuments] = useState(false);
  
  const { casos, selectedCase, setSelectedCase, showCases, setShowCases, handleShowCases, handleViewCaseClick, handleDeleteCase, handleAddCase, handleAddCaseClick, isAddCaseModalOpen, setIsAddCaseModalOpen, editableCase, setEditableCase, filter, setFilter, handleEstadoChange } = useCases(selectedClient, setShowDocuments, setShowCaseDocuments);
  
  const { documentos, handleShowDocuments, handleViewDocuments, handleDeleteDocument, handleDownloadDocument, handleUploadDocument } = useDocuments(selectedClient, selectedCase, setShowDocuments, setShowCaseDocuments);

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editableClient, setEditableClient] = useState({});
  const [isNewClient, setIsNewClient] = useState(false);

  useEffect(() => {
    getClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (client) => {
    setEditableClient(client);
    setIsEditModalOpen(true);
    setIsNewClient(false);
  };

  const handleAddClick = () => {
    setEditableClient({ idUsuario: clients.length + 1, idRol: 2, correo: '', cedula: '', nombre: '', apellidos: '', telefono: '' });
    setIsAddModalOpen(true);
    setIsNewClient(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableClient({ ...editableClient, [name]: value });
  };

  const handleCaseInputChange = (e) => {
    const { name, value } = e.target;
    setEditableCase({ ...editableCase, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      if (isNewClient) {
        await handleAddClient(editableClient);
        setIsAddModalOpen(false);
      } else {
        await handleUpdateClient(editableClient);
        setSelectedClient(editableClient);
        setIsEditModalOpen(false);
      }
      getClients();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleSaveCase = async () => {
    await handleAddCase(editableCase);
    setIsAddCaseModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <section className="bg-gray-200 h-auto flex justify-between">
        <nav>
          <ul className="flex ">
            <div className='w-[225px] border-r-2 p-4 border-customLightGray h-full flex justify-center items-center'>
              <li className="font-semibold">Clientes</li>
            </div>
            <div className='w-[210px] border-r-2 p-4 border-customLightGray h-full flex justify-center items-center hover:bg-gray-700 hover:border-white hover:text-white cursor-pointer' onClick={handleAddClick}>
              <li>Añadir nuevos clientes</li>
            </div>
          </ul>
        </nav>
      </section>
      <div className="flex flex-1">
        <aside className=" pr-6 flex flex-col ml-5 mt-10">
        <div className="mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
            <input
              type="text"
              className="w-full p-3 rounded-l-lg outline-none"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          {filteredClients.map((client, index) => (
            <div
              key={client.idUsuario}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => {
                setSelectedClient(client);
                setShowCases(false);
                setSelectedCase(null); 
                setShowDocuments(false);
                setShowCaseDocuments(false);
              }}
            >
              <span className="text-gray-800">{index + 1}. {client.nombre} {client.apellidos}</span>
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          ))}
        </div>
      </aside>
        <div className="flex-1 p-8">
          {selectedClient ? (
            <>
              <div className="bg-gray-900 text-white p-4 flex justify-between rounded-md items-center">
                <div className="text-xl font-semibold">Información Cliente</div>
                <button className="bg-green-500 text-white px-4 py-2 rounded">Activo</button>
              </div>
              <div className="bg-gray-100 rounded-md p-4 mt-2">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-900 w-24 h-24 rounded-full flex justify-center items-center">
                    <span role="img" aria-label="user" className="text-white text-4xl">👤</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-xl">{selectedClient.nombre} {selectedClient.apellidos}</div>
                    <div className="flex space-x-4 mt-2">
                      <button className="flex items-center space-x-1" onClick={() => handleEditClick(selectedClient)}>
                        <span role="img" aria-label="edit">✏️</span>
                        <span>Editar</span>
                      </button>
                      <button className="flex items-center space-x-1" onClick={() => handleDeleteClient(selectedClient.idUsuario)}>
                        <span role="img" aria-label="delete">🗑️</span>
                        <span>Eliminar</span>
                      </button>
                      <button className="flex items-center space-x-1" onClick={handleShowCases}>
                        <span role="img" aria-label="cases">📂</span>
                        <span>Casos</span>
                      </button>
                      <button className="flex items-center space-x-1" onClick={handleShowDocuments}>
                        <span role="img" aria-label="documents">📄</span>
                        <span>Documentos</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="bg-white p-8 mt-6 rounded-lg shadow-lg border border-gray-200">
              <h2 class="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">Información General</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">ID</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{selectedClient.idUsuario}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Nombre</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{selectedClient.nombre}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Apellidos</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{selectedClient.apellidos}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Cédula</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{selectedClient.cedula}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600">Correo Electrónico</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{selectedClient.correo}</div>
                </div>
                <div class="group">
                  <div class="text-sm font-medium text-gray-500 mb-1 transition-colors group-hover:text-indigo-600"># Teléfono</div>
                  <div class="text-base text-gray-800 font-semibold transition-colors group-hover:text-indigo-800">{selectedClient.telefono}</div>
                </div>
              </div>
            </div>
              </div>
              {showCases && !selectedCase && (
                <div>
                  <Casos casos={casos} handleAddCaseClick={handleAddCaseClick} handleViewCaseClick={handleViewCaseClick} filter={filter} setFilter={setFilter} />
                </div>
              )}
              {selectedCase && !showCaseDocuments && (
                <Caso caso={selectedCase} handleDeleteCase={handleDeleteCase} handleViewDocuments={handleViewDocuments} handleEstadoChange={handleEstadoChange} />
              )}
              {showDocuments && (
                <Documentos documentos={documentos} handleDownload={handleDownloadDocument} handleDelete={handleDeleteDocument} />
              )}
              {showCaseDocuments && (
                <DocumentosCaso documentos={documentos} handleDownload={handleDownloadDocument} handleDelete={handleDeleteDocument} handleUpload={handleUploadDocument} />
              )}
            </>
          ) : (
            <div className="flex-1 p-4">Seleccione un cliente para ver su información.</div>
          )}
        </div>
      </div>

      <EditClientModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        client={editableClient}
        handleInputChange={handleInputChange}
        handleSaveChanges={handleSaveChanges}
      />

      <AddClientModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        client={editableClient}
        handleInputChange={handleInputChange}
        handleSaveChanges={handleSaveChanges}
      />

      <AddCaseModal
        isOpen={isAddCaseModalOpen}
        onRequestClose={() => setIsAddCaseModalOpen(false)}
        caseData={editableCase}
        handleInputChange={handleCaseInputChange}
        handleSaveCase={handleSaveCase}
      />
    </div>
  );
};

export default Clientes;
