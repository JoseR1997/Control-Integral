import { useState } from 'react';
import { fetchDocumentos as fetchDocumentosAPI, fetchDocumentosCaso as fetchDocumentosCasoAPI, eliminarDocumento as eliminarDocumentoAPI, descargarDocumento as descargarDocumentoAPI, handleUpload as handleUploadAPI } from '../api/documentos';

export const useDocuments = (selectedClient, selectedCase, setShowDocuments, setShowCaseDocuments) => {
  const [documentos, setDocumentos] = useState([]);

  const handleShowDocuments = async () => {
    if (selectedClient) {
      const documentosData = await fetchDocumentosAPI(selectedClient.idUsuario);
      setDocumentos(documentosData);
      setShowDocuments(true);
      setShowCaseDocuments(false); 
    }
  };

  const handleViewDocuments = async (idCaso) => {
    const documentosData = await fetchDocumentosCasoAPI(idCaso);
    setDocumentos(documentosData);
    setShowDocuments(false);
    setShowCaseDocuments(true); 
  };

  const handleDeleteDocument = async (idDocumento) => {
    const success = await eliminarDocumentoAPI(idDocumento);
    if (success) {
      if (selectedCase) {
        await handleViewDocuments(selectedCase.idCaso);
      } else if (selectedClient) {
        await handleShowDocuments();
      }
    }
  };

  const handleDownloadDocument = async (idDocumento) => {
    await descargarDocumentoAPI(idDocumento);
  };

  const handleUploadDocument = async (file, nombreDocumento) => {
    const success = await handleUploadAPI(file, nombreDocumento, selectedCase.idCaso, selectedClient.idUsuario);
    if (success) {
      await handleViewDocuments(selectedCase.idCaso);
    }
  };

  return { documentos, handleShowDocuments, handleViewDocuments, handleDeleteDocument, handleDownloadDocument, handleUploadDocument };
};
