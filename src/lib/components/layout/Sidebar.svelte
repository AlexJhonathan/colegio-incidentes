<script lang="ts">
  import { Home, AlertTriangle, Users, Settings } from 'lucide-svelte';
  import { page } from '$app/stores';

  const menu = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/incidentes', label: 'Mis Casos', icon: AlertTriangle },
    { href: '/estudiantes', label: 'Estudiantes', icon: Users },
    { href: '/config', label: 'Configuración', icon: Settings }
  ];
</script>

<aside class="fixed inset-y-0 left-0 w-64 bg-[#0B2E50] shadow-lg z-50 flex flex-col">
  <div class="p-6 border-b">
    <h2 class="text-xl font-bold text-white">Incidentes</h2>
    <p class="text-xs text-gray-200">Colegio Británico</p>
  </div>

  <nav class="flex-1 px-4 py-6 space-y-1">
    {#each menu as item}
      <a
        href={item.href}
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:text-white transition {$page.url.pathname === item.href ? 'text-blue-10 font-medium' : ''}"
      >
        <svelte:component this={item.icon} size={20} />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
</aside>