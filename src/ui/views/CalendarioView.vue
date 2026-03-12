<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSesionesStore } from '../stores/sesiones'
import { useEquiposStore } from '../stores/equipos'

const router = useRouter()
const store = useSesionesStore()
const equiposStore = useEquiposStore()

const currentDate = ref(new Date())
const showModal = ref(false)
const selectedDate = ref('')

const form = ref({
  fecha: '',
  equipoId: '',
  notas: '',
  ejercicios: []
})


const tituloMes = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()
})

const diasCalendario = computed(() => {
  const año = currentDate.value.getFullYear()
  const mes = currentDate.value.getMonth()
  
  const primerDia = new Date(año, mes, 1)
  const ultimoDia = new Date(año, mes + 1, 0)
  
  const dias = []
  
  // Días del mes anterior para alinear (Lunes a Domingo)
  let diaSemanaInicio = primerDia.getDay() // 0 = Domingo, 1 = Lunes
  if (diaSemanaInicio === 0) diaSemanaInicio = 7
  
  for (let i = diaSemanaInicio - 1; i > 0; i--) {
    const d = new Date(año, mes, 1 - i)
    dias.push({ fecha: d, actual: false })
  }
  
  // Días del mes actual
  for (let i = 1; i <= ultimoDia.getDate(); i++) {
    const d = new Date(año, mes, i)
    dias.push({ fecha: d, actual: true })
  }
  
  // Completar la cuadrícula (hasta 42 días, 6 semanas)
  const restante = 42 - dias.length
  for (let i = 1; i <= restante; i++) {
    const d = new Date(año, mes + 1, i)
    dias.push({ fecha: d, actual: false })
  }
  
  return dias
})

// Mapear fecha a string YYYY-MM-DD local
function toDateStr(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function sesionesPorDia(fechaStr: string) {
  return store.sesiones.filter(s => s.fecha === fechaStr)
}

function cambiarMes(delta: number) {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
}


function abrirModalNuevaSesion(fechaStr: string) {
  selectedDate.value = fechaStr
  form.value = {
    fecha: fechaStr,
    equipoId: '',
    notas: '',
    ejercicios: []
  }
  showModal.value = true
}

async function guardar() {
  const nueva = await store.crear(form.value)
  showModal.value = false
  router.push(`/entrenamiento/${nueva.id}`)
}

function nombreEquipo(id: string) {
  return equiposStore.porId(id)?.nombre || 'Equipo'
}
function colorEquipo(id: string) {
  return equiposStore.porId(id)?.color || 'var(--color-accent-primary)'
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Calendario de Entrenamientos</h1>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button class="btn btn-secondary" @click="cambiarMes(-1)">◀</button>
        <div style="font-weight: 700; min-width: 150px; text-align: center;">{{ tituloMes }}</div>
        <button class="btn btn-secondary" @click="cambiarMes(1)">▶</button>
      </div>
    </div>

    <div v-if="equiposStore.equipos.length === 0" class="card" style="text-align: center; padding: 3rem; margin-bottom: 2rem;">
      <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
        Necesitas crear al menos un equipo antes de poder planificar sesiones de entrenamiento.
      </p>
      <router-link to="/equipos" class="btn btn-primary">Ir a Equipos</router-link>
    </div>

    <div class="calendar-card card">
      <div class="calendar-header-days">
        <div class="day-name">Lunes</div>
        <div class="day-name">Martes</div>
        <div class="day-name">Miércoles</div>
        <div class="day-name">Jueves</div>
        <div class="day-name">Viernes</div>
        <div class="day-name">Sábado</div>
        <div class="day-name">Domingo</div>
      </div>
      
      <div class="calendar-grid">
        <div 
          v-for="(dia, idx) in diasCalendario" 
          :key="idx" 
          class="calendar-day"
          :class="{ 
            'other-month': !dia.actual, 
            'today': toDateStr(dia.fecha) === toDateStr(new Date()),
            'has-sessions': sesionesPorDia(toDateStr(dia.fecha)).length > 0
          }"
        >
          <div class="day-header">
            <span class="day-number">{{ dia.fecha.getDate() }}</span>
            <button 
              class="add-session-btn" 
              @click="abrirModalNuevaSesion(toDateStr(dia.fecha))"
              title="Añadir sesión"
              v-if="equiposStore.equipos.length > 0"
            >
              +
            </button>
          </div>
          
          <div class="sessions-list">
            <div 
              v-for="sesion in sesionesPorDia(toDateStr(dia.fecha))" 
              :key="sesion.id"
              class="session-badge"
              :style="{ borderLeftColor: colorEquipo(sesion.equipoId) }"
              @click="router.push(`/entrenamiento/${sesion.id}`)"
            >
              {{ nombreEquipo(sesion.equipoId) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h2>Nueva Sesión: {{ selectedDate }}</h2>
        
        <form @submit.prevent="guardar" style="margin-top: 1.5rem;">
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
            <label class="form-label">Notas Generales</label>
            <textarea v-model="form.notas" class="form-input" rows="3" placeholder="Objetivo de la sesión..."></textarea>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="!form.equipoId">Crear y Añadir Ejercicios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-card {
  padding: 0;
  overflow: hidden;
}

.calendar-header-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
}

.day-name {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  border-right: 1px solid var(--color-border);
}
.day-name:last-child {
  border-right: none;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--color-border);
  gap: 1px;
}

.calendar-day {
  background: var(--color-bg-card);
  min-height: 120px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
}

.calendar-day.other-month {
  background: rgba(30, 41, 59, 0.5); /* Slate 800 darker */
}

.calendar-day.other-month .day-number {
  color: var(--color-text-secondary);
  opacity: 0.5;
}

.calendar-day.today .day-number {
  background: var(--color-accent-primary);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.day-number {
  font-weight: 600;
  font-size: 0.875rem;
}

.add-session-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  line-height: 1;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
}

.calendar-day:hover .add-session-btn {
  opacity: 1;
}

.add-session-btn:hover {
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.session-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-bg-elevated);
  border-radius: 4px;
  border-left: 3px solid var(--color-accent-primary);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.2s;
}

.session-badge:hover {
  background: var(--color-border);
}
@media (max-width: 768px) {
  .day-name {
    padding: 0.5rem;
    font-size: 0.7rem;
  }
  
  .calendar-day {
    min-height: 80px;
    padding: 0.25rem;
  }
  
  .day-number {
    font-size: 0.75rem;
  }
  
  .session-badge {
    font-size: 0.65rem;
    padding: 0.125rem 0.25rem;
  }

  .add-session-btn {
    opacity: 1;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .calendar-header-days {
    display: none; /* Ocultar nombres de días en móviles muy pequeños */
  }
  
  .calendar-day {
    min-height: 60px;
  }
  
  .sessions-list {
    display: none; /* Mostrar solo indicadores o dots en pantallas muy pequeñas */
  }
  
  .calendar-day::after {
    content: '';
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-accent-primary);
    margin-top: auto;
    margin-left: auto;
    opacity: 0;
  }
  
  .calendar-day.has-sessions::after {
    opacity: 1;
  }
}
</style>
