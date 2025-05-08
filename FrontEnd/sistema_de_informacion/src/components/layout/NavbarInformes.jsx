import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const NavbarInformes = ({ activeLink, setActiveLink }) => {
  const location = useLocation();

  const sections = useMemo(() => [
    'Casos y numeros de seguridad', 
    'Citas', 
    'Modificaciones', 
    'Actividad de Usuarios'
  ], []);

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    if (currentPath) {
      const formattedPath = sections.find(section => 
        section.toLowerCase().replace(/\s/g, '-') === currentPath
      );
      if (formattedPath) {
        setActiveLink(formattedPath);
      }
    }
  }, [location, sections, setActiveLink]);

  const handleClick = (e, section) => {
    e.preventDefault();
    setActiveLink(section);
  };

  return (
    <section className='font-inter flex items-center justify-center bg-gray-100 border-black w-full h-[60px]'>
      <nav className="flex justify-evenly w-full mx-10 h-full">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`flex justify-center w-full border-customBorder ${
              activeLink === section ? 'text-gray underline font-bold' : 'text-black'
            }`}
          >
            <a
              className="flex items-center justify-center w-full h-full border-r-2 p-4 border-customLightGray"
              href={`#${section.toLowerCase().replace(/\s/g, '-')}`}
              onClick={(e) => handleClick(e, section)}
            >
              {section}
            </a>
          </div>
        ))}
      </nav>
    </section>
  );
};

export default NavbarInformes;
