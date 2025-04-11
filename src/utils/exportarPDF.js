
// src/utils/exportarPDF.js

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportarPDF(itinerario) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Itinerario de Viaje', 14, 20)

  const headers = [['Día', 'Orden', 'Tipo', 'Descripción', 'Cantidad', 'Precio Unitario', 'Total']]
  const rows = []

  let total = 0

  itinerario.forEach((servicio, idx) => {
    const totalServicio = (servicio.precio || 0) * (servicio.cantidad || 1)
    total += totalServicio

    rows.push([
      servicio.dia,
      servicio.orden,
      servicio.tipo,
      servicio.descripcion,
      servicio.cantidad,
      `$${(servicio.precio || 0).toLocaleString()}`,
      `$${totalServicio.toLocaleString()}`
    ])
  })

  autoTable(doc, {
    startY: 30,
    head: headers,
    body: rows,
    theme: 'striped',
    styles: { fontSize: 10 }
  })

  doc.setFontSize(12)
  doc.text(`💰 Total estimado: $${total.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10)

  doc.save('cotizacion-viaje.pdf')
}
