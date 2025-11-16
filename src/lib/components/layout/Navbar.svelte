<script lang="ts">
  import { Bell, Search } from 'lucide-svelte';
</script>

<header class="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
  <div class="flex items-center gap-4 flex-1 max-w-md">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Buscar casos..."
        class="pl-10 pr-4 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <div class="flex items-center gap-4">
    <button class="relative p-2 text-gray-600 hover:text-blue-700">
      <Bell size={20} />
      <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
  </div>
</header>