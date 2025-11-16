import { writable } from 'svelte/store';

export type Rol = 'Regente' | 'Docente' | 'Bienestar' | 'Dirección de Nivel' | 'Dirección General';

export interface Usuario {
  id: string;
  nombre: string;
  rol: Rol;
}

function createAuthStore() {
  const { subscribe, set } = writable<Usuario | null>(null);

  return {
    subscribe,
    login: (usuario: Usuario) => set(usuario),
    logout: () => set(null)
  };
}

export const auth = createAuthStore();