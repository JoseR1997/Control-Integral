import { decodeToken } from '../utils/utils';

const fetchDocumentos = async (idCliente) => {
  const token = localStorage.getItem('token');
  const requestBody = { token, idCliente };

  console.log('Request body to /obtenerDocumentosPorCliente:', requestBody);

  try {
    const response = await fetch('/obtenerDocumentosPorCliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const result = await response.json();

    if (result.IsSuccessful) {
      return result.Details;
    } else {
      console.error('Error fetching documents:', result.Description);
      return [];
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

const fetchDocumentosCaso = async (idCaso) => {
  const token = localStorage.getItem('token');
  const requestBody = { token, idCaso };

  console.log('Request body to /obtenerDocumentosPorCaso:', requestBody);

  try {
    const response = await fetch('/obtenerDocumentosPorCaso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const result = await response.json();

    if (result.IsSuccessful) {
      return result.Details;
    } else {
      console.error('Error fetching case documents:', result.Description);
      return [];
    }
  } catch (error) {
    console.error('Error fetching case documents:', error);
    return [];
  }
};

const eliminarDocumento = async (idDocumento) => {
  const token = localStorage.getItem('token');
  const { idRol } = decodeToken();

  const requestBody = { token, idRol, idDocumento };

  console.log('Request body to /eliminarDocumento:', requestBody);

  try {
    const response = await fetch('/eliminarDocumento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.Code === 0) {
      return true;
    } else {
      console.error('Error deleting document:', result.Description);
      return false;
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};

const descargarDocumento = async (idDocumento) => {
  const token = localStorage.getItem('token');
  const requestBody = { token, idDocumento };

  console.log('Request body to /descargarDocumento:', requestBody);

  try {
    const response = await fetch('/descargarDocumento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }

    console.log('Response headers:', response.headers);

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    console.log('Content-Disposition:', contentDisposition);

    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'documento.pdf'; 

    console.log('Filename:', filename);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; 
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Error downloading document:', error);
  }
};

const handleUpload = async (file, nombreDocumento, idCaso, idCliente) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('documento', file);
  formData.append('nombreDocumento', nombreDocumento);
  formData.append('token', token);
  formData.append('idCaso', idCaso);
  formData.append('idCliente', idCliente);

  console.log('Request body to /guardarDocumento:', formData);

  try {
    const response = await fetch('/guardarDocumento', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.IsSuccessful) {
      return true;
    } else {
      console.error('Error uploading document:', result.Description);
      return false;
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    return false;
  }
};

export { fetchDocumentos, fetchDocumentosCaso, eliminarDocumento, descargarDocumento, handleUpload };

