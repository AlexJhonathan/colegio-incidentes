<script lang="ts">
  import { goto } from '$app/navigation';

  function login() {
    goto('/dashboard');
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
  <div class="w-full max-w-md">
    <div class="bg-white rounded-xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-800">Colegio Británico</h1>
        <p class="text-gray-600 mt-2">Sistema de Gestión</p>
      </div>

      <form on:submit|preventDefault={login} class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
          Iniciar Sesión
        </button>
      </form>

      <p class="text-xs text-center text-gray-500 mt-6">
        Versión temporal • Sin autenticación real
      </p>
    </div>
  </div>
</div>