<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '../app.css';
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Navbar from '$lib/components/layout/Navbar.svelte';

  // Mostrar Sidebar y Navbar en todas las rutas EXCEPTO "/"
  $: showDashboard = $page.url.pathname !== '/';
</script>

{#if showDashboard}
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64">
      <Navbar />
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
{:else}
  <!-- Login sin layout -->
  <slot />
{/if}