// src/lib/stores/incidenteStore.ts
import { writable } from 'svelte/store';
import type { Incidente } from '$lib/types/incidentes';

export const incidentes = writable<Incidente[]>([]);

export function agregarIncidente(nuevo: Incidente) {
    incidentes.update(lista => [nuevo, ...lista]);
}
