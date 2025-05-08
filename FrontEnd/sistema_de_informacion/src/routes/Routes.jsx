import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/layout/Header';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Clientes from '../pages/Clientes';
import Facturas from '../pages/Facturas';
import Perfil from '../pages/Perfil';
import Informes from '../pages/Informes';
import GestionServicios from '../pages/Gestión de servicios';
import Servicios from '../pages/Servicios';
import Citas from "../pages/Citas"
import AdminWhatsApp from "../pages/AdminWhatsApp"

const AppRoutes = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/facturas" element={<Facturas />} />
        <Route path="/Informes" element={<Informes />} />
        <Route path="/Servicios" element={<GestionServicios />} />
        <Route path="/Servicios." element={<Servicios />} />
        <Route path="/AdminWhatsApp" element={<AdminWhatsApp />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;