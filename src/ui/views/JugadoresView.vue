<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJugadoresStore } from '../stores/jugadores'
import { useEquiposStore } from '../stores/equipos'
import type { Jugador } from '../../core/domain/entities'

const store = useJugadoresStore()
const equiposStore = useEquiposStore()

const showModal = ref(false)
const jugadorEditando = ref<Jugador | null>(null)
const equipoFiltro = ref<string>('')

const form = ref({
  nombre: '',
  apellido: '',
  equipoId: '',
  posicion: '',
  numero: null as number | null,
  altura: null as number | null,
  peso: null as number | null,
  edad: null as number | null,
  fechaNacimiento: ''
})

const jugadoresFiltrados = computed(() => {
  if (!equipoFiltro.value) return store.jugadores
  return store.porEquipo(equipoFiltro.value)
})

function abrirModal(jugador?: Jugador) {
  if (jugador) {
    jugadorEditando.value = jugador
    form.value = { ...jugador }
  } else {
    jugadorEditando.value = null
    form.value = {
      nombre: '', apellido: '', equipoId: equipoFiltro.value || '',
      posicion: '', numero: null, altura: null, peso: null, edad: null, fechaNacimiento: ''
    }
  }
  showModal.value = true
}

async function guardar() {
  if (jugadorEditando.value) {
    await store.actualizar(jugadorEditando.value.id, form.value)
  } else {
    await store.crear(form.value)
  }
  showModal.value = false
}

async function eliminar(id: string) {
  if (confirm('¿Eliminar a este jugador? Se perderán sus resultados históricos.')) {
    await store.eliminar(id)
  }
}

function nombreEquipo(equipoId: string) {
  const equipo = equiposStore.porId(equipoId)
  return equipo ? equipo.nombre : 'Sin equipo'
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Jugadores</h1>
      <div style="display: flex; gap: 1rem;">
        <select v-model="equipoFiltro" class="form-select" style="width: 250px;">
          <option value="">Todos los equipos</option>
          <option v-for="eq in equiposStore.equipos" :key="eq.id" :value="eq.id">
            {{ eq.nombre }}
          </option>
        </select>
        <button class="btn btn-primary" @click="abrirModal()" :disabled="equiposStore.equipos.length === 0">
          + Nuevo Jugador
        </button>
      </div>
    </div>

    <div v-if="equiposStore.equipos.length === 0" class="card" style="text-align: center; padding: 3rem;">
      <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
        Necesitas crear al menos un equipo antes de poder agregar jugadores.
      </p>
      <router-link to="/equipos" class="btn btn-primary">Ir a Equipos</router-link>
    </div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Equipo</th>
            <th>Nº</th>
            <th>Posición</th>
            <th>Medidas</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="jugador in jugadoresFiltrados" :key="jugador.id">
            <td>
              <div class="player-name">{{ jugador.nombre }} {{ jugador.apellido }}</div>
            </td>
            <td>
              <span class="badge badge-cyan">{{ nombreEquipo(jugador.equipoId) }}</span>
            </td>
            <td>{{ jugador.numero || '-' }}</td>
            <td>{{ jugador.posicion || '-' }}</td>
            <td class="metrics-cell">
              <span v-if="jugador.altura">{{ jugador.altura }} cm</span>
              <span v-if="jugador.peso">{{ jugador.peso }} kg</span>
              <span v-if="!jugador.altura && !jugador.peso">-</span>
            </td>
            <td>{{ jugador.edad || '-' }}</td>
            <td>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm" @click="abrirModal(jugador)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="eliminar(jugador.id)">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="jugadoresFiltrados.length === 0">
            <td colspan="7" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
              No hay jugadores registrados en este equipo aún.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h2>{{ jugadorEditando ? 'Editar Jugador' : 'Nuevo Jugador' }}</h2>
        
        <form @submit.prevent="guardar" style="margin-top: 1.5rem;">
          <div class="grid grid-cols-2" style="gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input v-model="form.nombre" type="text" class="form-input" required />
            </div>
            
            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input v-model="form.apellido" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Equipo</label>
              <select v-model="form.equipoId" class="form-select" required>
                <option value="" disabled>Seleccionar equipo...</option>
                <option v-for="eq in equiposStore.equipos" :key="eq.id" :value="eq.id">
                  {{ eq.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Posición en campo</label>
              <input v-model="form.posicion" type="text" class="form-input" placeholder="Ej. Delantero" />
            </div>

            <div class="form-group">
              <label class="form-label">Número (Dorsal)</label>
              <input v-model="form.numero" type="number" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Edad</label>
              <input v-model="form.edad" type="number" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Altura (cm)</label>
              <input v-model="form.altura" type="number" step="0.1" class="form-input" placeholder="Ej. 180" />
            </div>

            <div class="form-group">
              <label class="form-label">Peso (kg)</label>
              <input v-model="form.peso" type="number" step="0.1" class="form-input" placeholder="Ej. 75.5" />
            </div>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Jugador</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.metrics-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}
</style>
