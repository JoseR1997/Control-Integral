import { decodeToken } from '../utils/utils';
import { getIdAbogado } from './usuarios';

const fetchCasos = async (idCliente, estado) => {
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
    idCliente,
    idAbogado,
    estado
  };

  console.log('Request body to /obtieneCasosPorClienteYAbogado:', requestBody);

  try {
    const response = await fetch('/obtieneCasosPorClienteYAbogado', {
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

    const result = await response.json();

    if (result.IsSuccessful) {
      return result.Details;
    } else {
      console.error('Error fetching cases:', result.Description);
      return [];
    }
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
};

const fetchCaso = async (idCaso) => {
  const token = localStorage.getItem('token');
  const requestBody = { token, idCaso };

  console.log('Request body to /obtieneCaso:', requestBody);

  try {
    const response = await fetch('/obtieneCaso', {
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

    const result = await response.json();

    if (result.IsSuccessful) {
      return result.Details;
    } else {
      console.error('Error fetching case:', result.Description);
      return null;
    }
  } catch (error) {
    console.error('Error fetching case:', error);
    return null;
  }
};

const eliminarCaso = async (idCaso) => {
  const token = localStorage.getItem('token');
  const { idRol } = decodeToken();

  const requestBody = { token, idRol, idCaso };

  console.log('Request body to /eliminaCaso:', requestBody);

  try {
    const response = await fetch('/eliminaCaso', {
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
      console.error('Error deleting case:', result.Description);
      return false;
    }
  } catch (error) {
    console.error('Error deleting case:', error);
    return false;
  }
};


const actualizaEstadoCaso = async (idCaso, nuevoEstado) => {
  const token = localStorage.getItem('token');
  const { idRol } = decodeToken();

  const requestBody = { token, idRol, idCaso, nuevoEstado };

  console.log('Request body to /actualizaEstadoCaso:', requestBody);

  try {
    const response = await fetch('/actualizaEstadoCaso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const text = await response.text(); 

    try {
      const result = JSON.parse(text); 
      if (result.Code === 0) {
        return result.Details;
      } else {
        console.error('Error updating case status:', result.Description);
        return null;
      }
    } catch (error) {
      console.error('Error parsing JSON response:', text);
      return null;
    }
  } catch (error) {
    console.error('Error updating case status:', error);
    return null;
  }
};

//Clientes

const fetchCasosPorCliente = async (idCliente) => {
  const token = localStorage.getItem('token');
  const { usuario, idRol } = decodeToken();

  const requestBody = {
    token,
    idRol,
    idCliente,
  };

  try {
    const response = await fetch('/api/obtieneCasosPorCliente', {
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
      console.error('Error fetching cases:', result.Description);
      return [];
    }
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
};

export { fetchCasos, fetchCaso, eliminarCaso, actualizaEstadoCaso, fetchCasosPorCliente  };

