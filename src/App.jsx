import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AdminPanel from './admin/AdminPanel'
import ProveedoresView from './admin/ProveedoresView'
import ServiciosView from './admin/ServiciosView'
import CotizadorView from './admin/CotizadorView'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-white shadow mb-6">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">✈️ Generador de Viajes</h1>
            <nav className="space-x-4">
              <Link to="/" className="text-blue-600 hover:underline">Inicio</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6">
          <Routes>
            <Route path="/admin/proveedores" element={<ProveedoresView />} />
            <Route path="/admin/servicios" element={<ServiciosView />} />
            <Route path="/admin/cotizar" element={<CotizadorView />} />
            <Route path="/" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
