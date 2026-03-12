<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSesionesStore } from '../stores/sesiones'
import { useEquiposStore } from '../stores/equipos'
import { useEjerciciosStore } from '../stores/ejercicios'
import { useJugadoresStore } from '../stores/jugadores'
import { useResultadosStore } from '../stores/resultados'
import type { ValorMetrica } from '../../core/domain/entities'

const route = useRoute()
const router = useRouter()
const sesionesStore = useSesionesStore()
const equiposStore = useEquiposStore()
const ejerciciosStore = useEjerciciosStore()
const jugadoresStore = useJugadoresStore()
const resultadosStore = useResultadosStore()

const id = route.params.id as string
const sesion = computed(() => sesionesStore.porId(id))
const equipo = computed(() => sesion.value ? equiposStore.porId(sesion.value.equipoId) : null)
const jugadoresEquipo = computed(() => sesion.value ? jugadoresStore.porEquipo(sesion.value.equipoId) : [])

const ejercicioSeleccionadoId = ref('')
const tabActivaIdx = ref(0)
const guardando = ref(false)

// Datos locales para edición rápida de resultados
const resultadosEditables = ref<Record<string, Record<string, Record<string, number>>>>({})

onMounted(async () => {
  if (!sesion.value) {
    await sesionesStore.cargar()
  }
  if (!equipo.value) {
    await equiposStore.cargar()
  }
  if (jugadoresEquipo.value.length === 0) {
    await jugadoresStore.cargar()
  }
  if (ejerciciosStore.ejercicios.length === 0) {
    await ejerciciosStore.cargar()
  }
  await resultadosStore.cargar()
  
  inicializarResultados()
})

function inicializarResultados() {
  const sesionId = id
  const resultadosActuales = resultadosStore.porSesion(sesionId)
  
  const map: Record<string, Record<string, Record<string, number>>> = {}
  
  resultadosActuales.forEach(r => {
    if (!map[r.ejercicioId]) map[r.ejercicioId] = {}
    if (!map[r.ejercicioId]![r.jugadorId]) map[r.ejercicioId]![r.jugadorId] = {}
    
    r.valores.forEach(v => {
      map[r.ejercicioId]![r.jugadorId]![v.metricaId] = v.valor
    })
  })
  
  resultadosEditables.value = map
}

const ejerciciosDisponibles = computed(() => {
  const idsEnSesion = new Set(sesion.value?.ejercicios.map(e => e.ejercicioId) || [])
  return ejerciciosStore.ejercicios.filter(e => !idsEnSesion.has(e.id))
})

const ejercicioActual = computed(() => {
  if (!sesion.value || sesion.value.ejercicios.length === 0) return null
  const item = sesion.value.ejercicios[tabActivaIdx.value]
  if (!item) return null
  return ejerciciosStore.porId(item.ejercicioId)
})

async function agregarEjercicio() {
  if (!ejercicioSeleccionadoId.value) return
  await sesionesStore.agregarEjercicioASesion(id, {
    ejercicioId: ejercicioSeleccionadoId.value,
    notas: ''
  })
  ejercicioSeleccionadoId.value = ''
  tabActivaIdx.value = sesion.value!.ejercicios.length - 1
}

async function quitarEjercicioActual() {
  if (!ejercicioActual.value || !confirm('¿Quitar este ejercicio de la sesión?')) return
  const idEjercicio = ejercicioActual.value.id
  await sesionesStore.quitarEjercicioDeSesion(id, idEjercicio)
  tabActivaIdx.value = 0
}

async function guardarResultados() {
  if (!sesion.value || !ejercicioActual.value) return
  guardando.value = true
  
  const ejercicioId = ejercicioActual.value.id
  const datosEjercicio = resultadosEditables.value[ejercicioId] || {}
  
  const promesas = jugadoresEquipo.value.map(async (jugador) => {
    const valoresJugador = datosEjercicio[jugador.id] || {}
    const valores: ValorMetrica[] = ejercicioActual.value!.metricas.map(m => ({
      metricaId: m.id,
      valor: valoresJugador[m.id] || 0
    }))
    
    // Solo guardar si hay valores distintos de cero o si ya existía el registro
    await resultadosStore.registrar({
      sesionId: id,
      ejercicioId: ejercicioId,
      jugadorId: jugador.id,
      valores
    })
  })
  
  await Promise.all(promesas)
  guardando.value = false
  alert('Resultados guardados correctamente')
}

function getValor(jugadorId: string, metricaId: string): number {
  if (!ejercicioActual.value) return 0
  const ejId = ejercicioActual.value.id
  if (!resultadosEditables.value[ejId]) return 0
  if (!resultadosEditables.value[ejId][jugadorId]) return 0
  return resultadosEditables.value[ejId][jugadorId][metricaId] || 0
}

function updateValor(jugadorId: string, metricaId: string, valor: string) {
  if (!ejercicioActual.value) return
  const ejId = ejercicioActual.value.id
  if (!resultadosEditables.value[ejId]) resultadosEditables.value[ejId] = {}
  if (!resultadosEditables.value[ejId][jugadorId]) resultadosEditables.value[ejId][jugadorId] = {}
  resultadosEditables.value[ejId][jugadorId][metricaId] = parseFloat(valor) || 0
}

async function eliminarSesion() {
  if (confirm('¿Estás seguro de eliminar esta sesión completa?')) {
    await sesionesStore.eliminar(id)
    router.push('/calendario')
  }
}
</script>

<template>
  <div v-if="sesion" class="fade-in">
    <div class="page-header">
      <div>
        <router-link to="/calendario" class="back-link">← Volver al calendario</router-link>
        <h1 class="page-title">Sesión: {{ equipo?.nombre }}</h1>
        <p class="subtitle">{{ sesion.fecha }} • {{ sesion.ejercicios.length }} ejercicios planificados</p>
      </div>
      <div class="actions">
        <button class="btn btn-danger" @click="eliminarSesion">Eliminar Sesión</button>
      </div>
    </div>

    <!-- Gestión de Ejercicios -->
    <div class="card" style="margin-bottom: 2rem;">
      <div style="display: flex; gap: 1rem; align-items: flex-end;">
        <div class="form-group" style="flex: 1; margin-bottom: 0;">
          <label class="form-label">Añadir ejercicio a la sesión</label>
          <select v-model="ejercicioSeleccionadoId" class="form-select">
            <option value="" disabled>Seleccione un ejercicio...</option>
            <option v-for="ex in ejerciciosDisponibles" :key="ex.id" :value="ex.id">
              {{ ex.nombre }}
            </option>
          </select>
        </div>
        <button class="btn btn-primary" @click="agregarEjercicio" :disabled="!ejercicioSeleccionadoId">
          Añadir
        </button>
      </div>
    </div>

    <div v-if="sesion.ejercicios.length === 0" class="empty-state">
      <p>Aún no hay ejercicios en esta sesión. Selecciona uno arriba para comenzar.</p>
    </div>

    <div v-else>
      <!-- Tabs de Ejercicios -->
      <div class="tabs-container">
        <button 
          v-for="(item, idx) in sesion.ejercicios" 
          :key="item.ejercicioId"
          class="tab-btn"
          :class="{ active: tabActivaIdx === idx }"
          @click="tabActivaIdx = idx"
        >
          {{ ejerciciosStore.porId(item.ejercicioId)?.nombre || 'Cargando...' }}
        </button>
      </div>

      <!-- Tabla de Resultados -->
      <div v-if="ejercicioActual" class="card fade-in" style="border-top-left-radius: 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
          <div>
            <h2 style="margin-bottom: 0.25rem;">{{ ejercicioActual.nombre }}</h2>
            <p style="color: var(--color-text-secondary); font-size: 0.875rem;">{{ ejercicioActual.descripcion }}</p>
          </div>
          <button class="btn btn-secondary btn-sm" @click="quitarEjercicioActual">Quitar Ejercicio</button>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width: 250px;">Jugador</th>
                <th v-for="m in ejercicioActual.metricas" :key="m.id">
                  {{ m.nombre }} <span class="unit">({{ m.unidad }})</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="jugador in jugadoresEquipo" :key="jugador.id">
                <td class="player-cell">
                  <strong>{{ jugador.nombre }} {{ jugador.apellido }}</strong>
                  <span class="pos">{{ jugador.posicion }} #{{ jugador.numero }}</span>
                </td>
                <td v-for="m in ejercicioActual.metricas" :key="m.id">
                  <input 
                    type="number" 
                    step="0.01" 
                    class="form-input res-input" 
                    :value="getValor(jugador.id, m.id)"
                    @input="e => updateValor(jugador.id, m.id, (e.target as HTMLInputElement).value)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
          <button class="btn btn-primary btn-lg" @click="guardarResultados" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar Resultados de este Ejercicio' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="empty-state">
    <p>Sesión no encontrada.</p>
  </div>
</template>

<style scoped>
.back-link {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.125rem;
}

.tabs-container {
  display: flex;
  overflow-x: auto;
  gap: 0.25rem;
  margin-bottom: -1px;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

.tab-btn.active {
  background: var(--color-bg-card);
  border-bottom-color: transparent;
  color: var(--color-accent-primary);
  position: relative;
  z-index: 10;
}

.player-cell {
  display: flex;
  flex-direction: column;
}

.player-cell .pos {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.unit {
  font-size: 0.7rem;
  text-transform: lowercase;
  opacity: 0.7;
}

.res-input {
  width: 100px;
  text-align: center;
  padding: 0.5rem;
}

.btn-lg {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

.empty-state {
  text-align: center;
  padding: 5rem;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  color: var(--color-text-secondary);
}
</style>
