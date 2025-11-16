<!-- src\lib\components\incidentes\IncidentesPanel.svelte -->
<script lang="ts">
  import {
    Search, Filter, Plus, Eye, Edit, Forward,
    CheckCircle, AlertTriangle, Clock, X
  } from 'lucide-svelte';
 
  import { onMount } from 'svelte';
  import { obtenerIncidentes, obtenerIncidente, actualizarIncidente, mapToUI, crearIncidente } from "$lib/services/incidenteService";
  import type { IncidenteUI, IncidenteAPI, IncidenteCrear } from "$lib/types/incidentes";

  let casos: IncidenteUI[] = [];
  let loading = true;

  onMount(async () => {
    try {
      const apiData = await obtenerIncidentes();   // ← IncidenteAPI[]
      casos = apiData.map(mapToUI);                // ← IncidenteUI[]
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  });
  // --- Tipos ---
  type Estado = 'Abierto' | 'En Seguimiento' | 'Cerrado' | 'Derivado';
  type Gravedad = 'Leve' | 'Grave' | 'Muy Grave';
  type Tipo = 'Conductual' | 'Emocional' | 'Académico' | 'Salud';

  interface AccionHistorial {
    tipo: 'registro' | 'seguimiento' | 'derivado' | 'cerrado';
    titulo: string;
    responsable: string;
    fechaHora: string;
    descripcion: string;
  }

  interface Incidente {
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

  $: casosFiltrados = casos.filter(caso => {
    const coincideEstudiante = caso.estudiantes.some(e => 
      e.toLowerCase().includes(busqueda.toLowerCase())
    );
    const coincideEstado = estadoFiltro === 'Todos' || caso.estado === estadoFiltro;
    return coincideEstudiante && coincideEstado;
  });
  // --- Datos estáticos (solo para mostrar)
  

  // --- Filtros ---
  let busqueda = '';
  let estadoFiltro: Estado | 'Todos' = 'Todos';

   $: estudiantesFiltrados = estudiantesDisponibles.filter(e =>
    e.toLowerCase().includes(busquedaEstudiante.toLowerCase()) &&
    !estudiantesSeleccionados.includes(e)
  );

  function agregarEstudiante(estudiante: string) {
    estudiantesSeleccionados = [...estudiantesSeleccionados, estudiante];
    busquedaEstudiante = '';
    showDropdown = false;
  }

  function eliminarEstudiante(estudiante: string) {
    estudiantesSeleccionados = estudiantesSeleccionados.filter(e => e !== estudiante);
  }

  // --- Configuración visual ---
  const estadoConfig = {
    'Abierto': { color: 'bg-red-100 text-red-700', icon: AlertTriangle },
    'En Seguimiento': { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    'Cerrado': { color: 'bg-green-100 text-green-700', icon: CheckCircle },
    'Derivado': { color: 'bg-blue-100 text-blue-700', icon: Forward }
  };

  const gravedadConfig = {
    'Leve': 'bg-green-100 text-green-700',
    'Grave': 'bg-orange-100 text-orange-700',
    'Muy Grave': 'bg-red-100 text-red-700'
  };

  // --- Modal Registrar (CONEXIÓN REAL)
  let showModal = false;
  let fecha = '';
  let gravedad: Gravedad = 'Leve';
  let tipo: Tipo = 'Conductual';
  let antecedentess = '';
  let descripcion = '';

  // Estudiantes (autocompletado)
  const estudiantesDisponibles = [
    'María González', 'Carlos López', 'Sofía Mendoza', 'Luis Pérez',
    'Ana Torres', 'Pedro Sánchez', 'Laura Vargas', 'Diego Morales'
  ];
  let estudiantesSeleccionados: string[] = [];
  let busquedaEstudiante = '';
  let showDropdown = false;
  

  let antecedentes = "";
  let acciones_tomadas = "";
  let seguimiento = "";
  let id_estudiantes: number[] = [];
  let id_situaciones: number[] = [];
  const creado_por = 1; // fijo para pruebas

  function abrirModal() {
    showModal = true;
  }

  function cerrarModal() {
    showModal = false;
    antecedentes = "";
    acciones_tomadas = "";
    seguimiento = "";
    id_estudiantes = [];
    id_situaciones = [];
  }

  let showModalDetalles = false;
  let casoSeleccionado: IncidenteUI | null = null;

  function abrirModalDetalles(caso: IncidenteUI) {
    casoSeleccionado = caso;
    showModalDetalles = true;
  }

  function cerrarModalDetalles() {
    showModalDetalles = false;
    casoSeleccionado = null;
  }

  // --- Otros modales ---
  let showModalDerivar = false;
  let showModalCerrar = false;
  let showModalAtender = false;


  let showModalModificar = false;
  let incidenteEditando: IncidenteAPI | null = null;
  let edit_antecedentes = "";
  let edit_acciones_tomadas = "";
  let edit_seguimiento = "";
  let edit_id_estudiantes: number[] = [];
  let edit_id_situaciones: number[] = [];

  async function abrirModalModificar(caso: IncidenteUI) {
    const id = parseInt(caso.id.replace('INC-', ''));
    try {
      incidenteEditando = await obtenerIncidente(id);
      edit_antecedentes = incidenteEditando.antecedentes || "";
      edit_acciones_tomadas = incidenteEditando.acciones_tomadas || "";
      edit_seguimiento = incidenteEditando.seguimiento || "";
      edit_id_estudiantes = incidenteEditando.estudiantes.map(e => e.id_estudiante);
      edit_id_situaciones = incidenteEditando.situaciones?.map(s => s.id_situacion) || [];
      showModalModificar = true;
    } catch (err) {
      alert("No se pudo cargar el incidente");
    }
  }

  function cerrarModalModificar() {
    showModalModificar = false;
    incidenteEditando = null;
  }

  async function guardarModificacion() {
    if (!incidenteEditando) return;

    const payload: Partial<IncidenteCrear> = {
      antecedentes: edit_antecedentes,
      acciones_tomadas: edit_acciones_tomadas,
      seguimiento: edit_seguimiento,
      id_estudiantes: edit_id_estudiantes,
      id_situaciones: edit_id_situaciones,
      creado_por: 1
    };

    try {
      const actualizado = await actualizarIncidente(incidenteEditando.id_incidente, payload);
      casos = casos.map(c => c.id === `INC-${actualizado.id_incidente.toString().padStart(3, '0')}` ? mapToUI(actualizado) : c);
      alert("Incidente actualizado correctamente");
      cerrarModalModificar();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  }


  function abrirModalDerivar() { showModalDerivar = true; }
  function cerrarModalDerivar() { showModalDerivar = false; }
  function abrirModalCerrar() { showModalCerrar = true; }
  function cerrarModalCerrar() { showModalCerrar = false; }


  let casoAtender: IncidenteUI | null = null;
  let observacionSeguimiento = '';

  function abrirModalAtender(caso: IncidenteUI) {
    casoAtender = caso;
    observacionSeguimiento = '';
    showModalAtender = true;
  }

  function cerrarModalAtender() {
    showModalAtender = false;
    casoAtender = null;
    observacionSeguimiento = '';
  }

  function guardarSeguimiento() {
    if (!casoAtender) return;

    const seguimientosActuales = casoAtender.historial.filter(a => a.tipo === 'seguimiento').length;
    const nuevoTitulo = seguimientosActuales === 0 ? '1er Seguimiento' : `${seguimientosActuales + 1}to Seguimiento`;

    const nuevaAccion: AccionHistorial = {
      tipo: 'seguimiento',
      titulo: nuevoTitulo,
      responsable: 'Usuario Actual', // Cambiar por autenticación real después
      fechaHora: new Date().toISOString().slice(0, 16).replace('T', ' '),
      descripcion: observacionSeguimiento
    };

    // Actualizamos el historial (estático por ahora)
    casoAtender.historial = [...casoAtender.historial, nuevaAccion];
    casoAtender.estado = 'En Seguimiento' as Estado;

    cerrarModalAtender();
  }
  // 🚀 ***ESTA ES LA FUNCIÓN QUE GUARDA EN FASTAPI***
  async function registrar() {
    if (!antecedentes || id_estudiantes.length === 0 || id_situaciones.length === 0) {
      alert("Faltan campos obligatorios.");
      return;
    }

    const payload = {
      antecedentes,
      acciones_tomadas,
      seguimiento,
      id_estudiantes,
      id_situaciones,
      creado_por
    };

    console.log("PAYLOAD → ", payload);

    try {
      const respuesta = await crearIncidente(payload);
      console.log("BACKEND RESPONDIÓ → ", respuesta);
      alert("Incidente registrado correctamente.");
    } catch (error) {
      console.error("Error al registrar incidente:", error);
      alert("Error al guardar el incidente.");
    }

    cerrarModal();
  }


</script>

<!-- ============================= -->
<!--  UI DEL PANEL (NO SE CAMBIA) -->
<!-- ============================= -->

<div class="max-w-7xl mx-auto p-3 space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Seguimiento de Incidentes Estudiantiles</h1>
      <p class="text-sm text-gray-600">Gestión de casos y seguimiento institucional</p>
    </div>

    <button
      on:click={abrirModal}
      class="bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-600"
    >
      <Plus size={18} /> Registrar Incidente
    </button>
  </div>

  <!-- Filtros -->
  <div class="bg-white rounded-xl shadow-md p-5 border border-gray-200">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          bind:value={busqueda}
          placeholder="Buscar incidente..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      <div class="relative">
        <Filter class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <select bind:value={estadoFiltro} class="w-full pl-10 pr-8 py-2 border rounded-lg">
          <option value="Todos">Todos los estados</option>
          <option value="Abierto">Abierto</option>
          <option value="En Seguimiento">En Seguimiento</option>
          <option value="Cerrado">Cerrado</option>
          <option value="Derivado">Derivado</option>
        </select>
      </div>
    </div>
  </div>



  <div class="space-y-4">
    {#each casosFiltrados as caso}
      {@const EstadoIcon = estadoConfig[caso.estado].icon}
      <div class="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 transition-all duration-100 hover:border-[#2C6FB0] hover:border hover:shadow-lg">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold text-gray-800">
                {caso.estudiantes.join(', ')}
              </h3>
              <span class="px-2 py-1 rounded-full text-xs font-medium {estadoConfig[caso.estado].color} flex items-center gap-1">
                <svelte:component this={EstadoIcon} size={14} />
                {caso.estado}
              </span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                {caso.tipo}
              </span>
            </div>
            <p class="text-gray-700 mb-3">{caso.descripcion}</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p class="text-gray-500">ID del Caso</p>
                <p class="font-mono font-medium">{caso.id}</p>
              </div>
              <div>
                <p class="text-gray-500">Fecha</p>
                <p class="font-medium">{caso.fecha}</p>
              </div>
              <div>
                <p class="text-gray-500">Responsable</p>
                <p class="font-medium truncate">{caso.responsable}</p>
              </div>
              <div>
                <p class="text-gray-500">Nivel</p>
                <p class="font-medium">{caso.nivel}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <span class="px-3 py-1 rounded-full text-xs font-medium {gravedadConfig[caso.gravedad]}">
              {caso.gravedad}
            </span>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="mt-8 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
          <button
            on:click={() => abrirModalDetalles(caso)}
            class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <Eye size={16} /> Ver Detalles
          </button>
          <button
            on:click={() => abrirModalAtender(caso)}
            class="flex items-center gap-2 px-3 py-2 text-sm bg-[#3AC0B8] text-white rounded-lg hover:bg-[#32a89e] transition font-medium"
          >
            <Plus size={16} /> Atender Caso
          </button>
          <button
            on:click={() => abrirModalModificar(caso)}
            class="flex items-center gap-2 px-3 py-2 text-sm border border-blue-400 rounded-lg text-gray-700 hover:bg-blue-50 transition"
          >
            <Edit size={16} /> Modificar
          </button>
          <button on:click={abrirModalDerivar} class="flex items-center gap-2 px-3 py-2 text-sm border border-purple-400 rounded-lg text-gray-700 hover:bg-purple-50 transition">
            <Forward size={16} /> Derivar
          </button>
          <button on:click={abrirModalCerrar} class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <CheckCircle size={16} /> Cerrar Caso
          </button>
        </div>
      </div>
    {/each}

    {#if casosFiltrados.length === 0}
      <div class="text-center py-12 text-gray-500">
        <AlertTriangle size={48} class="mx-auto mb-3 text-gray-300" />
        <p>No se encontraron incidentes con los filtros aplicados.</p>
      </div>
    {/if}
  </div>

</div>



<!-- MODAL REGISTRAR -->
{#if showModal}
<div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">

    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Registrar Incidente</h2>
      <button on:click={cerrarModal}><X size={22} /></button>
    </div>

    <div class="space-y-6 mt-4">

      <!-- Antecedentes -->
      <div>
        <label>Antecedentes *</label>
        <textarea bind:value={antecedentes} rows="3" class="w-full border rounded-lg p-2"></textarea>
      </div>

      <!-- Acciones -->
      <div>
        <label>Acciones tomadas</label>
        <textarea bind:value={acciones_tomadas} rows="3" class="w-full border rounded-lg p-2"></textarea>
      </div>

      <!-- Seguimiento -->
      <div>
        <label>Seguimiento</label>
        <textarea bind:value={seguimiento} rows="3" class="w-full border rounded-lg p-2"></textarea>
      </div>

      <!-- IDs estudiantes -->
      <div>
        <label>ID de estudiantes *</label>
        <input
          type="text"
          placeholder="1, 2, 3"
          class="w-full border p-2 rounded-lg"
          on:input={(e) => {
            const t = e.currentTarget.value;
            id_estudiantes = t.split(',').map(x => x.trim()).filter(x => x !== "").map(Number);
          }}
        />
      </div>

      <!-- IDs situaciones -->
      <div>
        <label>ID de situaciones *</label>
        <input
          type="text"
          placeholder="3, 5"
          class="w-full border p-2 rounded-lg"
          on:input={(e) => {
            const t = e.currentTarget.value;
            id_situaciones = t.split(',').map(x => x.trim()).filter(x => x !== "").map(Number);
          }}
        />
      </div>

      <div class="flex justify-end gap-3">
        <button on:click={cerrarModal} class="px-4 py-2 border rounded-lg">Cancelar</button>
        <button on:click={registrar} class="px-4 py-2 bg-cyan-500 text-white rounded-lg">
          Registrar
        </button>
      </div>
    </div>

  </div>
</div>
{/if}


{#if showModalDetalles && casoSeleccionado}
  <div class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 pb-2">
        <h2 class="text-xl font-bold text-gray-800">Detalles del Caso – {casoSeleccionado.id}</h2>
        <button on:click={cerrarModalDetalles} class="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Encabezado del caso -->
        <div class="bg-cyan-500 text-white p-4 rounded-xl">
          <h3 class="text-lg font-semibold">{casoSeleccionado.estudiantes.join(', ')}</h3>
          <p class="text-cyan-50">{casoSeleccionado.descripcion}</p>
        </div>

        <!-- Línea de tiempo -->
        <div class="relative">
          {#each casoSeleccionado.historial as accion, i}
            <div class="flex gap-4 mb-6">
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
                {#if i < casoSeleccionado.historial.length - 1}
                  <div class="w-0.5 h-full bg-gray-300 mt-2"></div>
                {/if}
              </div>
              <div class="flex-1 pb-8">
                <div class="bg-white rounded-lg p-4 shadow-sm border">
                  <h4 class="font-medium text-gray-800">{accion.titulo}</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    {accion.responsable} • {accion.fechaHora}
                  </p>
                  <div class="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {accion.descripcion}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="p-6 bg-gray-50 rounded-b-xl">
        <button
          on:click={cerrarModalDetalles}
          class="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
{/if}


{#if showModalAtender && casoAtender}
  <div class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 pb-2">
        <h2 class="text-xl font-bold text-gray-800">
          Agregar Seguimiento
        </h2>
        <button on:click={cerrarModalAtender} class="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div class="p-6 space-y-5">
        <!-- Contenedor gris con info del caso -->
        <div class="bg-gray-100 p-4 rounded-xl text-sm">
          <p class="font-medium text-gray-800">Caso: {casoAtender.id}</p>
          <p class="text-gray-600 mt-1">{casoAtender.estudiantes.join(', ')}</p>
          <p class="text-gray-600 mt-1">{casoAtender.descripcion}</p>
        </div>

        <!-- Campo de observación -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Observación / Seguimiento
          </label>
          <textarea
            bind:value={observacionSeguimiento}
            placeholder="Agregue las observaciones o acciones realizadas..."
            rows="5"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none bg-gray-50"
          />
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-xl">
        <button
          on:click={cerrarModalAtender}
          class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          on:click={guardarSeguimiento}
          class="px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
        >
          Guardar Seguimiento
        </button>
      </div>
    </div>
  </div>
{/if}


{#if showModalModificar && incidenteEditando}
<div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Modificar Incidente</h2>
      <button on:click={cerrarModalModificar}><X size={22} /></button>
    </div>

    <div class="space-y-6">

      <!-- Antecedentes -->
      <div>
        <label>Antecedentes *</label>
        <textarea bind:value={edit_antecedentes} rows="3" class="w-full border rounded-lg p-2"></textarea>
      </div>

      <!-- Acciones -->
      <div>
        <label>Acciones tomadas</label>
        <textarea bind:value={edit_acciones_tomadas} rows="3" class="w-full border rounded-lg p-2"></textarea>
      </div>

      <!-- Seguimiento -->
      <div>
        <label>Seguimiento</label>
        <textarea bind:value={edit_seguimiento} rows="3" class="w-full border rounded-lg p-2"></textarea>
      </div>

      <!-- IDs estudiantes -->
      <div>
        <label>ID de estudiantes *</label>
        <input
          type="text"
          value={edit_id_estudiantes.join(', ')}
          placeholder="1, 2, 3"
          class="w-full border p-2 rounded-lg"
          on:input={(e) => {
            const val = e.currentTarget.value;
            edit_id_estudiantes = val
              .split(',')
              .map(x => x.trim())
              .filter(x => x !== '')
              .map(Number)
              .filter(n => !isNaN(n)); // evita NaN
          }}
        />
      </div>

      <!-- IDs situaciones -->
      <div>
        <label>ID de situaciones *</label>
        <input
          type="text"
          value={edit_id_situaciones.join(', ')}
          placeholder="3, 5"
          class="w-full border p-2 rounded-lg"
          on:input={(e) => {
            const val = e.currentTarget.value;
            edit_id_situaciones = val
              .split(',')
              .map(x => x.trim())
              .filter(x => x !== '')
              .map(Number)
              .filter(n => !isNaN(n));
          }}
        />
      </div>

      <div class="flex justify-end gap-3">
        <button on:click={cerrarModalModificar} class="px-4 py-2 border rounded-lg">Cancelar</button>
        <button on:click={guardarModificacion} class="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Guardar Cambios
        </button>
      </div>
    </div>

  </div>
</div>
{/if}


{#if showModalDerivar}
  <div class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 pb-2">
        <h2 class="text-xl font-bold text-gray-800">Derivar Incidente</h2>
        <button on:click={cerrarModalDerivar} class="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div class="p-6 space-y-5">
        <!-- Observacion -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Observacion</label>
          <textarea
            bind:value={descripcion}
            placeholder="Se deriva el caso por..."
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <!-- Botones del modal -->
      <div class="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-xl">
        <button
          on:click={cerrarModal}
          class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          on:click={registrar}
          class="px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
        >
          Derivar
        </button>
      </div>
    </div>
  </div>
{/if}


{#if showModalCerrar}
  <div class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 pb-2">
        <h2 class="text-xl font-bold text-gray-800">Cerrar Caso</h2>
        <button on:click={cerrarModalCerrar} class="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div class="p-6 space-y-5 py-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">¿Estas seguro de que quieres cerrar el caso?</label>
        </div>
      </div>

      <div class="p-6 space-y-5 pt-2 pb-2">
        <!-- Observacion -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Observacion final</label>
          <textarea
            bind:value={descripcion}
            placeholder="Se cierra el caso por..."
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <!-- Botones del modal -->
      <div class="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-xl">
        <button
          on:click={cerrarModal}
          class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          on:click={registrar}
          class="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
        >
          Cerrar Caso
        </button>
      </div>
    </div>
  </div>
{/if}
