import React, { useState } from 'react';

export default function ClientModal({ isOpen, onClose, onGuardar }) {
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: ''
    });

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onGuardar(cliente);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Agregar Nuevo Cliente</h2>

                <div className="flex flex-col gap-3">
                    <input
                        name="nombre"
                        value={cliente.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="apellido"
                        value={cliente.apellido}
                        onChange={handleChange}
                        placeholder="Apellido"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="dni"
                        value={cliente.dni}
                        onChange={handleChange}
                        placeholder="DNI"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="email"
                        value={cliente.email}
                        onChange={handleChange}
                        placeholder="Email"
                        type="email"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="telefono"
                        value={cliente.telefono}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded w-full sm:w-auto"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
