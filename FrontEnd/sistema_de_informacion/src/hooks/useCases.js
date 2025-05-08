import { useState, useEffect } from 'react';
import { fetchCasos as fetchCasosAPI, fetchCaso as fetchCasoAPI, eliminarCaso as eliminarCasoAPI, actualizaEstadoCaso as actualizaEstadoCasoAPI } from '../api/casos';
import { decodeToken } from '../utils/utils';
import { getIdAbogado } from '../api/usuarios';

export const useCases = (selectedClient, setShowDocuments, setShowCaseDocuments) => {
  const [casos, setCasos] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCases, setShowCases] = useState(false);
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [editableCase, setEditableCase] = useState({});
  const [filter, setFilter] = useState('activos'); 

  useEffect(() => {
    if (selectedClient) {
      handleShowCases();
    }
  }, [filter, selectedClient]);

  const handleShowCases = async () => {
    if (selectedClient) {
      const estado = filter === 'activos' ? 1 : 2;
      const casosData = await fetchCasosAPI(selectedClient.idUsuario, estado);
      setCasos(casosData);
      setShowCases(true);
      setSelectedCase(null);
      setShowDocuments(false);
      setShowCaseDocuments(false);
    }
  };

  const handleViewCaseClick = async (idCaso) => {
    const casoData = await fetchCasoAPI(idCaso);
    setSelectedCase(casoData);
    setShowCases(false);
    setShowDocuments(false);
    setShowCaseDocuments(false);
  };

  const handleDeleteCase = async (idCaso) => {
    const success = await eliminarCasoAPI(idCaso);
    if (success) {
      setSelectedCase(null);
      await handleShowCases();
    }
  };

  const handleAddCaseClick = () => {
    setEditableCase({ titulo: '', descripcion: '', detalles: '' });
    setIsAddCaseModalOpen(true);
  };

  const handleAddCase = async (editableCase) => {
    const token = localStorage.getItem('token');
    const { usuario, idRol } = decodeToken();

    const idAbogado = await getIdAbogado(usuario);

    if (!idAbogado) {
      console.error('Error obtaining idAbogado');
      return;
    }

    const requestBody = {
      token,
      idRol,
      idUsuario: idAbogado,
      idCliente: selectedClient.idUsuario,
      ...editableCase
    };

    console.log('Request body to /CrearCaso:', requestBody);

    try {
      const response = await fetch('/CrearCaso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.Code === 0) {
        setIsAddCaseModalOpen(false);
        await handleShowCases();
      } else {
        console.error('Error saving case:', result.Description);
      }
    } catch (error) {
      console.error('Error saving case:', error);
    }
  };

  const handleEstadoChange = (idCaso, nuevoEstado) => {
    setCasos(prevCasos =>
      prevCasos.map(caso =>
        caso.idCaso === idCaso ? { ...caso, idEstado: nuevoEstado } : caso
      )
    );
    if (selectedCase?.idCaso === idCaso) {
      setSelectedCase(prevCase => ({ ...prevCase, idEstado: nuevoEstado }));
    }
  };

  return {
    casos,
    selectedCase,
    setSelectedCase,
    showCases,
    setShowCases,
    handleShowCases,
    handleViewCaseClick,
    handleDeleteCase,
    handleAddCaseClick,
    handleAddCase,
    isAddCaseModalOpen,
    setIsAddCaseModalOpen,
    editableCase,
    setEditableCase,
    filter, 
    setFilter,
    handleEstadoChange
  };
};
