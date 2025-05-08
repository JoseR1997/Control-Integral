const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/usuarios';

// Función para obtener la lista de usuarios
export const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      const text = await response.text();
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  };

// Función para eliminar un cliente
export const deleteClient = async (idUsuario) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${idUsuario}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting client');
      }
      return await response.text();
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

// Función para actualizar un cliente
export const updateClient = async (idUsuario, clientData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Error updating client');
      }
      return await response.text();
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }

  };

  //crea nuevo usuario 

export const createClient = async (clientData) => {
  try {
    const response = await fetch(`/api/CrearUsuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      throw new Error('Error creating client');
    }
    return await response.text();
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const getIdAbogado = async (correo) => {
  try {
    const response = await fetch(`/api/usuario?correo=${correo}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.idUsuario; 
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};