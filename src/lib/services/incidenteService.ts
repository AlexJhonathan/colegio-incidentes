// src/lib/services/incidenteService.ts
import type { IncidenteCrear, IncidenteAPI, IncidenteUI } from "$lib/types/incidentes";

const API = "http://127.0.0.1:8000";

export async function crearIncidente(data: IncidenteCrear): Promise<IncidenteAPI> {
  const res = await fetch(`${API}/incidentes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error al crear incidente");
  }
  return await res.json();   // <-- devuelve IncidenteAPI
}

export async function obtenerIncidentes(): Promise<IncidenteAPI[]> {
  const res = await fetch(`${API}/incidentes/`);
  if (!res.ok) throw new Error("Error al obtener incidentes");
  return await res.json();
}


export async function obtenerIncidente(id: number): Promise<IncidenteAPI> {
  const res = await fetch(`${API}/incidentes/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Incidente no encontrado");
  }
  return await res.json();
}

export async function actualizarIncidente(id: number, data: Partial<IncidenteCrear>): Promise<IncidenteAPI> {
  const res = await fetch(`${API}/incidentes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error al actualizar incidente");
  }
  return await res.json();
}


export async function cerrarIncidente(id: number, modificador_id: number = 1): Promise<IncidenteAPI> {
  const payload = {
    estado: "cerrado"
  };

  const res = await fetch(`${API}/incidentes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Error al cerrar el incidente");
  }

  return await res.json();
}


const estadoMap: Record<string, 'Abierto' | 'En Seguimiento' | 'Cerrado' | 'Derivado'> = {
  abierto: 'Abierto',
  derivado: 'Derivado',
  cerrado: 'Cerrado'
};

/* Opcional: función que convierte API → UI */
export function mapToUI(inc: IncidenteAPI): IncidenteUI {

  const estadoUI = estadoMap[inc.estado] || 'En Seguimiento';

  return {
    id: `INC-${inc.id_incidente.toString().padStart(3, '0')}`,
    estudiantes: inc.estudiantes.map(e =>
      `${e.nombres} ${e.apellido_paterno} ${e.apellido_materno}`
    ),
    descripcion: inc.antecedentes || 'Sin descripción',
    estado: estadoUI,
    tipo: 'Conductual',               // ← mapear desde situaciones cuando lo tengas
    fecha: new Date(inc.fecha).toLocaleDateString('es-ES'),
    responsable: 'Sistema',
    nivel: 'Regente',
    gravedad: 'Leve',
    historial: [
      {
        tipo: 'registro',
        titulo: 'Registro inicial',
        responsable: 'Sistema',
        fechaHora: inc.fecha.slice(0, 16).replace('T', ' '),
        descripcion: inc.antecedentes || ''
      }
    ]
  };
}