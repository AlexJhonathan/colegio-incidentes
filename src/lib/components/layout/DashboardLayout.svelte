<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  import Navbar from './Navbar.svelte';
</script>

<div class="min-h-screen bg-gray-50">
  <Sidebar />
  <div class="ml-64">
    <Navbar />
    <main class="p-6">
      <slot />
    </main>
  </div>
</div>