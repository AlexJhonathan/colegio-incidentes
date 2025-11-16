// src/lib/types/incidentes.ts

export type Estado = 'Abierto' | 'En Seguimiento' | 'Cerrado' | 'Derivado';
export type Gravedad = 'Leve' | 'Grave' | 'Muy Grave';
export type Tipo = 'Conductual' | 'Emocional' | 'Académico' | 'Salud';

export interface AccionHistorial {
  tipo: 'registro' | 'seguimiento' | 'derivado' | 'cerrado';
  titulo: string;
  responsable: string;
  fechaHora: string;
  descripcion: string;
}

export interface IncidenteUI {
  id: string;
  estudiantes: string[];
  descripcion: string;
  estado: Estado;
  tipo: Tipo;
  fecha: string;
  responsable: string;
  nivel: string;
  gravedad: Gravedad;
  historial: AccionHistorial[];
}

/* ---------- API ---------- */
export interface IncidenteAPI {
  id_incidente: number;
  fecha: string;
  antecedentes: string | null;
  acciones_tomadas: string | null;
  seguimiento: string | null;
  estado: 'provisional' | 'derivado' | 'cerrado';
  estudiantes: EstudianteRead[];
  adjuntos: AdjuntoRead[];
  situaciones: SituacionRead[];  // ← NUEVO
}

export interface SituacionRead {
  id_situacion: number;
  nombre_situacion: string;
  nivel_gravedad: string;
  id_area?: number;
}

/* 👇 ÚNICO agregado, sin cambiar nada tuyo */
export interface IncidenteCrear {
  antecedentes: string;
  acciones_tomadas: string;
  seguimiento: string;
  id_estudiantes: number[];
  id_situaciones: number[];
  creado_por: number;
}


export interface EstudianteRead {
  id_estudiante: number;
  ci: string | null;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
}

export interface AdjuntoRead {
  id_adjunto: number;
  nombre_archivo: string;
  ruta: string;
  tipo_mime: string | null;
  subido_por: number | null;
  fecha_subida: string;
}
