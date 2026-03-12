<script setup lang="ts">
import { useEquiposStore } from '../stores/equipos'
import { useJugadoresStore } from '../stores/jugadores'
import { useSesionesStore } from '../stores/sesiones'
import { useResultadosStore } from '../stores/resultados'

const equipos = useEquiposStore()
const jugadores = useJugadoresStore()
const sesiones = useSesionesStore()
const resultados = useResultadosStore()
</script>

<template>
  <div class="fade-in">
    <div class="page-header">
      <h1 class="page-title">Panel de Control</h1>
      <div class="header-meta">Resumen de actividad y métricas de rendimiento</div>
    </div>

    <div class="grid grid-cols-4" style="margin-bottom: 3rem;">
      <div class="stat-card">
        <div class="stat-main">
          <div class="stat-label">Equipos</div>
          <div class="stat-value">{{ equipos.equipos.length }}</div>
        </div>
        <div class="stat-indicator indigo"></div>
      </div>
      
      <div class="stat-card">
        <div class="stat-main">
          <div class="stat-label">Atletas</div>
          <div class="stat-value">{{ jugadores.jugadores.length }}</div>
        </div>
        <div class="stat-indicator sky"></div>
      </div>

      <div class="stat-card">
        <div class="stat-main">
          <div class="stat-label">Sesiones</div>
          <div class="stat-value">{{ sesiones.sesiones.length }}</div>
        </div>
        <div class="stat-indicator indigo"></div>
      </div>

      <div class="stat-card">
        <div class="stat-main">
          <div class="stat-label">Registros</div>
          <div class="stat-value">{{ resultados.resultados.length }}</div>
        </div>
        <div class="stat-indicator emerald"></div>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div class="card hero-card">
        <div class="hero-content">
          <h2 class="hero-title">Monitoreo de Rendimiento Deportivo</h2>
          <p class="hero-text">
            Bienvenido al sistema de cuantificación de entrenamiento. Gestione sus equipos, defina métricas personalizadas y analice el progreso técnico-físico de sus jugadores con precisión.
          </p>
          <div class="action-grid">
            <router-link to="/equipos" class="action-item">
              <span class="action-icon">🛡️</span>
              <div class="action-info">
                <div class="action-name">Configurar Equipos</div>
                <div class="action-desc">Administre plantillas y colores corporativos</div>
              </div>
            </router-link>
            <router-link to="/calendario" class="action-item">
              <span class="action-icon">📅</span>
              <div class="action-info">
                <div class="action-name">Planificar Sesión</div>
                <div class="action-desc">Coordine entrenamientos en el calendario</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div class="card info-card">
        <h3 class="section-title">Metodología de Análisis</h3>
        <div class="info-steps">
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-content">
              <strong>Definición de Métricas:</strong> Configure ejercicios con unidades precisas y objetivos de rendimiento.
            </div>
          </div>
          <div class="step">
            <div class="step-num Security">02</div>
            <div class="step-content">
              <strong>Toma de Datos:</strong> Ingrese los resultados directamente desde el campo por cada sesión.
            </div>
          </div>
          <div class="step">
            <div class="step-num">03</div>
            <div class="step-content">
              <strong>Generación de Rankings:</strong> Visualice el rendimiento promedio agrupado por equipo y categoría.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-meta {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
}

.stat-indicator {
  width: 4px;
  height: 40px;
  border-radius: 2px;
}

.stat-indicator.indigo { background: var(--color-accent-primary); }
.stat-indicator.sky { background: var(--color-accent-secondary); }
.stat-indicator.emerald { background: var(--color-success); }

.hero-card {
  background: linear-gradient(135deg, var(--color-bg-card) 0%, #1e1e2e 100%);
  border-left: 4px solid var(--color-accent-primary);
}

.hero-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.hero-text {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
  line-height: 1.7;
}

.action-grid {
  display: grid;
  gap: 1rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.action-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--color-accent-primary);
}

.action-icon {
  font-size: 1.5rem;
}

.action-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.action-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.section-title {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: var(--color-text-primary);
}

.info-steps {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.step {
  display: flex;
  gap: 1.25rem;
}

.step-num {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent-primary);
  opacity: 0.5;
  width: 32px;
}

.step-content {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.step-content strong {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  font-size: 0.9375rem;
}
</style>
