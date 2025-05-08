import { useState, useEffect } from 'react';
import { fetchClients, deleteClient, updateClient, createClient } from '../api/usuarios';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddClient = async (client) => {
    await createClient(client);
    getClients();
  };

  const handleUpdateClient = async (client) => {
    await updateClient(client.idUsuario, client);
    getClients();
  };

  const handleDeleteClient = async (idUsuario) => {
    await deleteClient(idUsuario);
    setClients(clients.filter(client => client.idUsuario !== idUsuario));
    setSelectedClient(null);
  };

  return {
    clients,
    selectedClient,
    setSelectedClient,
    handleAddClient,
    handleUpdateClient,
    handleDeleteClient,
    getClients
  };
};
