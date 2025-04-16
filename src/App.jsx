import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import CotizadorView from './admin/CotizadorView'
import ProveedoresView from './admin/ProveedoresView'
import ServiciosView from './admin/ServiciosView'
import CotizacionesView from './admin/CotizacionesView'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Navbar superior centrado */}
        <header className="bg-neutral-800 text-white shadow">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center space-y-2 sm:flex-col">
            <h1 className="text-2xl font-semibold mb-2 sm:mb-4">✈️ Anda Travel</h1>

            <nav className="flex justify-center space-x-8 text-sm font-medium">
              <Link to="/cotizador" className="hover:underline hover:text-blue-200">🧾 Cotizador</Link>
              <Link to="/cotizaciones" className="hover:underline hover:text-blue-200">🧾 Cotizaciones</Link>
              <Link to="/proveedores" className="hover:underline hover:text-blue-200">🧑‍💼 Proveedores</Link>
              <Link to="/servicios" className="hover:underline hover:text-blue-200">🛎️ Servicios</Link>

            </nav>
          </div>
        </header>


        {/* Contenido dinámico */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/cotizador" />} />
            <Route path="/cotizador" element={<CotizadorView />} />
            <Route path="/proveedores" element={<ProveedoresView />} />
            <Route path="/servicios" element={<ServiciosView />} />
            <Route path="/cotizaciones" element={<CotizacionesView />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
