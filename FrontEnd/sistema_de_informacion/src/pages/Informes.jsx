import React, { useState, useEffect } from 'react';
import NavbarInformes from '../components/layout/NavbarInformes';
import CasosYNumerosDeSeguridad from '../components/specific/CasosYNumerosDeSeguridad';
import Citas from '../components/specific/Citas';
import Modificaciones from '../components/specific/Modificaciones';
import ActividadUsuarios from '../components/specific/ActividadUsuarios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Informes = () => {
  const [activeLink, setActiveLink] = useState('Casos y numeros de seguridad');

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

  return (
    <>
      <NavbarInformes activeLink={activeLink} setActiveLink={setActiveLink} />

      <section className='content w-full h-full font-inter'>
        {activeLink === 'Casos y numeros de seguridad' && (
          <section id="casos-y-numeros-de-seguridad" className='h-svh' >
            <CasosYNumerosDeSeguridad/>
          </section>
        )}
        {activeLink === 'Citas' && (
          <section id="citas" className='h-svh'>
            <Citas/>
          </section>
        )}
        {activeLink === 'Modificaciones' && (
          <section id="modificaciones" className='h-svh'>
             <Modificaciones/>
          </section>
        )}
        {activeLink === 'Actividad de Usuarios' && (
          <section id="actividad-usuarios" className='h-svh'>
            <ActividadUsuarios/>
            <h2>hola</h2>
          </section>
        )}
      </section>
    </>
  );
};

export default Informes;
