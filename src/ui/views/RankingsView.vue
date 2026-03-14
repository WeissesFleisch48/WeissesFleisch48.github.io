<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRankingsStore } from '../stores/rankings'
import { useEquiposStore } from '../stores/equipos'
import { useEjerciciosStore } from '../stores/ejercicios'

const rankingsStore = useRankingsStore()
const equiposStore = useEquiposStore()
const ejerciciosStore = useEjerciciosStore()

const tabActiva = ref('equipos') // 'equipos', 'categorias', 'jugadores'
const filtroEquipoId = ref('')
const filtroEjercicioId = ref('')

onMounted(async () => {
  await Promise.all([
    equiposStore.cargar(),
    ejerciciosStore.cargar(),
    recargarRanking()
  ])
})

async function recargarRanking() {
  if (tabActiva.value === 'equipos') {
    await rankingsStore.cargarRankingEquipos(filtroEjercicioId.value || undefined)
  } else if (tabActiva.value === 'categorias') {
    await rankingsStore.cargarRankingCategorias(filtroEquipoId.value || undefined)
  } else if (tabActiva.value === 'jugadores') {
    await rankingsStore.cargarRankingJugadores(
      filtroEquipoId.value || undefined, 
      filtroEjercicioId.value || undefined
    )
  }
}

watch([tabActiva, filtroEquipoId, filtroEjercicioId], () => {
  recargarRanking()
})

function getAnchoBarra(promedio: number, maxPromedio: number) {
  if (maxPromedio === 0) return '0%'
  const percentage = (promedio / maxPromedio) * 100
  return `${Math.min(percentage, 100)}%`
}

const maxPromedioEquipos = computed(() => Math.max(...rankingsStore.rankingEquipos.map(r => r.promedio), 1))
const maxPromedioCats = computed(() => Math.max(...rankingsStore.rankingCategorias.map(r => r.promedio), 1))
const maxPromedioJugadores = computed(() => Math.max(...rankingsStore.rankingJugadores.map(r => r.promedio), 1))

import { computed } from 'vue'
</script>

<template>
  <div class="fade-in">
    <div class="page-header">
      <h1 class="page-title">Rankings de Rendimiento</h1>
    </div>

    <!-- Filtros Globales -->
    <div class="card card-gradient filters-card" style="margin-bottom: 2rem;">
      <div class="grid grid-cols-3" style="gap: 1.5rem; align-items: flex-end;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Filtrar por Equipo</label>
          <select v-model="filtroEquipoId" class="form-select">
            <option value="">Todos los equipos</option>
            <option v-for="eq in equiposStore.equipos" :key="eq.id" :value="eq.id">
              {{ eq.nombre }}
            </option>
          </select>
        </div>
        
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Filtrar por Ejercicio</label>
          <select v-model="filtroEjercicioId" class="form-select">
            <option value="">Todos los ejercicios</option>
            <option v-for="ex in ejerciciosStore.ejercicios" :key="ex.id" :value="ex.id">
              {{ ex.nombre }}
            </option>
          </select>
        </div>

        <button class="btn btn-secondary" @click="recargarRanking">
          Actualizar Análisis
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="ranking-tabs">
      <button 
        class="r-tab" 
        :class="{ active: tabActiva === 'equipos' }" 
        @click="tabActiva = 'equipos'"
      >
        Rank Equipos
      </button>
      <button 
        class="r-tab" 
        :class="{ active: tabActiva === 'categorias' }" 
        @click="tabActiva = 'categorias'"
      >
        Rank Categorías
      </button>
      <button 
        class="r-tab" 
        :class="{ active: tabActiva === 'jugadores' }" 
        @click="tabActiva = 'jugadores'"
      >
        Rank Jugadores
      </button>
    </div>

    <div v-if="rankingsStore.cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Calculando promedios...</p>
    </div>

    <div v-else class="ranking-content">
      <!-- Ranking Equipos -->
      <div v-if="tabActiva === 'equipos'" class="fade-in">
        <div v-if="rankingsStore.rankingEquipos.length === 0" class="empty-mini">
          No hay datos suficientes para generar el ranking de equipos.
        </div>
        <div v-for="(item, index) in rankingsStore.rankingEquipos" :key="item.equipo.id" class="ranking-row card">
          <div class="rank-number">#{{ index + 1 }}</div>
          <div class="rank-info">
            <div class="rank-name-row">
              <div class="team-color-dot" :style="{ backgroundColor: item.equipo.color }"></div>
              <h3>{{ item.equipo.nombre }}</h3>
            </div>
            <div class="rank-stats">
              <span>{{ item.totalJugadores }} jugadores</span> • 
              <span>{{ item.totalRegistros }} registros toma de datos</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill emerald" :style="{ width: getAnchoBarra(item.promedio, maxPromedioEquipos) }"></div>
              </div>
              <div class="rank-value">{{ item.promedio.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ranking Categorías -->
      <div v-if="tabActiva === 'categorias'" class="fade-in">
        <div v-if="rankingsStore.rankingCategorias.length === 0" class="empty-mini">
          No hay datos de resultados para las categorías.
        </div>
        <div v-for="(item, index) in rankingsStore.rankingCategorias" :key="item.categoria.id" class="ranking-row card">
          <div class="rank-number">#{{ index + 1 }}</div>
          <div class="rank-info">
            <div class="rank-name-row">
              <div class="team-color-dot" :style="{ backgroundColor: item.categoria.color }"></div>
              <h3>{{ item.categoria.nombre }}</h3>
            </div>
            <div class="rank-stats">
              <span>{{ item.totalRegistros }} resultados en esta categoría</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill cyan" :style="{ width: getAnchoBarra(item.promedio, maxPromedioCats) }"></div>
              </div>
              <div class="rank-value">{{ item.promedio.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ranking Jugadores -->
      <div v-if="tabActiva === 'jugadores'" class="fade-in">
        <div v-if="rankingsStore.rankingJugadores.length === 0" class="empty-mini">
          Registra resultados en las sesiones para ver el ranking de jugadores.
        </div>
        <div v-for="(item, index) in rankingsStore.rankingJugadores" :key="item.jugador.id" class="ranking-row card">
          <div class="rank-number">#{{ index + 1 }}</div>
          <div class="rank-info">
            <div class="rank-name-row">
              <h3>{{ item.jugador.nombre }} {{ item.jugador.apellido }}</h3>
              <span class="badge badge-cyan">{{ equiposStore.porId(item.jugador.equipoId)?.nombre }}</span>
            </div>
            <div class="rank-stats">
              <span>{{ item.jugador.posicion }}</span> • 
              <span>{{ item.totalRegistros }} registros de entrenamiento</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="{ width: getAnchoBarra(item.promedio, maxPromedioJugadores) }"></div>
              </div>
              <div class="rank-value">{{ item.promedio.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters-card {
  background: var(--color-bg-elevated);
}

.ranking-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.r-tab {
  flex: 1;
  padding: 1rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.r-tab:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-text-primary);
}

.r-tab.active {
  background: rgba(6, 182, 212, 0.1);
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
}

.ranking-row {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
}

.rank-number {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-secondary);
  min-width: 40px;
}

.rank-info {
  flex: 1;
}

.rank-name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.team-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.rank-stats {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar-bg {
  flex: 1;
  height: 8px;
  background: var(--color-bg-base);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-accent-primary);
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-bar-fill.emerald { background: var(--color-accent-secondary); }
.progress-bar-fill.cyan { background: var(--color-accent-primary); }

.rank-value {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  color: var(--color-text-primary);
  min-width: 50px;
  text-align: right;
}

.loading-state {
  text-align: center;
  padding: 5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(6, 182, 212, 0.1);
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-mini {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
}
</style>
