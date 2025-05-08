import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const socket = io('http://localhost:5000');


const AdminWhatsApp = () => {

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
  
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState('disconnected');

    useEffect(() => {
        socket.on('qr', (qr) => {
            console.log('QR received:', qr);
            setQrCode(qr);
        });

        socket.on('whatsapp-status', (newStatus) => {
            console.log('New status:', newStatus);
            setStatus(newStatus);
        });

        return () => {
            socket.off('qr');
            socket.off('whatsapp-status');
        };
    }, []);
    
    const connectWhatsApp = async () => {
        const response = await fetch('/whatsapp-connect', { method: 'POST' });
        const data = await response.json();
        console.log(data.message);
    };

    const disconnectWhatsApp = async () => {
        const response = await fetch('/whatsapp-disconnect', { method: 'POST' });
        const data = await response.json();
        console.log(data.message);
        setQrCode(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
                    Administrador de WhatsApp para Citas y Calendario
                </h1>
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Crear conexión</h2>
                        <p className="text-gray-700 mb-8">
                            Para iniciar sesión, escanea el siguiente código QR con tu aplicación de WhatsApp.
                        </p>
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex space-x-4">
                                <button
                                    onClick={connectWhatsApp}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Refrescar QR
                                </button>
                                <button
                                    onClick={disconnectWhatsApp}
                                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Desconectar
                                </button>
                            </div>
                            {qrCode && (
                                <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
                                    <img src={qrCode} alt="QR Code" className="max-w-xs mx-auto" />
                                </div>
                            )}
                            <div className="text-center">
                                <span className="font-semibold text-gray-700">Estado de la conexión: </span>
                                <span className={`font-bold ${status === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWhatsApp;