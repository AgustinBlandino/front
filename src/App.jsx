import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CotizadorView from './admin/CotizadorView';
import ProveedoresView from './admin/ProveedoresView';
import ServiciosView from './admin/ServiciosView';
import CotizacionesView from './admin/CotizacionesView';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Navbar superior */}
        <header className="bg-neutral-800 text-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-2">
            <h1 className="text-2xl font-semibold">✈️ Anda Travel</h1>
            <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              <Link to="/cotizador" className="hover:text-blue-300">🧾 Cotizador</Link>
              <Link to="/cotizaciones" className="hover:text-blue-300">📁 Cotizaciones</Link>
              <Link to="/proveedores" className="hover:text-blue-300">🧑‍💼 Proveedores</Link>
              <Link to="/servicios" className="hover:text-blue-300">🛎️ Servicios</Link>
            </nav>
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/cotizador" />} />
            <Route path="/cotizador" element={<CotizadorView />} />
            <Route path="/cotizaciones" element={<CotizacionesView />} />
            <Route path="/proveedores" element={<ProveedoresView />} />
            <Route path="/servicios" element={<ServiciosView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
