import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { decodeToken } from '../../utils/utils';

const Header = () => {
  const [activeLink, setActiveLink] = useState('');
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const sections = ['Home', 'Clientes', 'Citas', 'Servicios', 'Informes', 'Facturas'];
  const sectionsCliente = ['Home', 'Perfil', 'Citas', 'Servicios.'];

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    setActiveLink(currentPath.charAt(0).toUpperCase() + currentPath.slice(1));

    const decodedToken = decodeToken();
    if (decodedToken) {
      setRole(decodedToken.idRol);
      fetchUserName(decodedToken.usuario); 
    }
  }, [location]);

  const fetchUserName = async (correo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuario?correo=${correo}`);
      const data = await response.json();
      setUserName(`${data.nombre} ${data.apellidos}`);
    } catch (error) {
      console.error('Error fetching usuario:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const sectionsToDisplay = role === 1 ? sections : role === 2 ? sectionsCliente : [];

  return (
    <header className="bg-gray-900 text-white w-full shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-serif">{userName}</h1>
          <div className="flex items-center space-x-6">
            {localStorage.getItem('token') ? (
              <button onClick={handleLogout} className="text-sm uppercase tracking-wider hover:text-gold transition-colors duration-300">Log Out</button>
            ) : (
              <a href="/login" className="text-sm uppercase tracking-wider hover:text-gold transition-colors p-2 duration-300">Iniciar Sesión</a>
            )}
            <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <nav className={`bg-gray-800 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="container mx-auto px-4">
          <div className="md:flex md:justify-center">
            {sectionsToDisplay.map((section, index) => (
              <a
                key={index}
                href={`/${section.toLowerCase()}`}
                className={`block px-4 py-3 md:py-4 text-sm uppercase tracking-wider font-medium ${
                  activeLink === section
                    ? 'bg-gold text-gray-900'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } transition-colors duration-300`}
                onClick={() => {
                  setActiveLink(section);
                  setIsMenuOpen(false);
                }}
              >
                {section}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
