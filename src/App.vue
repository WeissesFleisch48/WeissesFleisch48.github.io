<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './ui/stores/auth'
import { useCategoriasStore } from './ui/stores/categorias'
import { useEjerciciosStore } from './ui/stores/ejercicios'
import { useEquiposStore } from './ui/stores/equipos'
import { useJugadoresStore } from './ui/stores/jugadores'
import { useSesionesStore } from './ui/stores/sesiones'
import { useResultadosStore } from './ui/stores/resultados'

const route = useRoute()
const auth = useAuthStore()
const isSidebarOpen = ref(false)

const mostrarLayout = computed(() => route.name !== 'login' && auth.estaAutenticado)

onMounted(async () => {
  if (auth.estaAutenticado) {
    cargarDatos()
  }
})

// Recargar datos cuando se loguea
watch(() => auth.estaAutenticado, (val) => {
  if (val) cargarDatos()
})

async function cargarDatos() {
  await Promise.all([
    useCategoriasStore().cargar(),
    useEjerciciosStore().cargar(),
    useEquiposStore().cargar(),
    useJugadoresStore().cargar(),
    useSesionesStore().cargar(),
    useResultadosStore().cargar(),
  ])
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function handleLogout() {
  if (confirm('¿Cerrar sesión?')) {
    auth.logout()
  }
}

// Cerrar el sidebar al cambiar de ruta en móviles
watch(() => route.path, () => {
  isSidebarOpen.value = false
})
</script>

<template>
  <div class="app-container" :class="{ 'no-layout': !mostrarLayout }">
    <!-- Header para móviles -->
    <header v-if="mostrarLayout" class="mobile-header">
      <div class="brand">
        <div class="brand-bolt">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bolt-svg">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <span class="brand-name">PERFORM<span class="text-indigo">Q</span></span>
      </div>
      <button class="menu-toggle" @click="toggleSidebar" :aria-label="isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'">
        <svg v-if="!isSidebarOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </header>

    <!-- Overlay para cerrar el sidebar en móviles -->
    <div v-if="mostrarLayout && isSidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>

    <nav v-if="mostrarLayout" class="sidebar" :class="{ 'open': isSidebarOpen }">
      <div class="sidebar-top">
        <div class="brand desktop-only">
          <div class="brand-bolt">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bolt-svg">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <span class="brand-name">PERFORM<span class="text-indigo">Q</span></span>
        </div>

        <div class="sidebar-scroll">
          <div class="nav-group">
            <router-link to="/" class="nav-item">
              <span class="nav-icon">📊</span> Dashboard
            </router-link>
          </div>

          <div class="nav-label">ORGANIZACIÓN</div>
          <div class="nav-group">
            <router-link to="/equipos" class="nav-item">
              <span class="nav-icon">🛡️</span> Equipos
            </router-link>
            <router-link to="/jugadores" class="nav-item">
              <span class="nav-icon">🏃</span> Jugadores
            </router-link>
          </div>

          <div class="nav-label">METODOLOGÍA</div>
          <div class="nav-group">
            <router-link to="/categorias" class="nav-item">
              <span class="nav-icon">📁</span> Categorías
            </router-link>
            <router-link to="/ejercicios" class="nav-item">
              <span class="nav-icon">🏋️</span> Ejercicios
            </router-link>
          </div>

          <div class="nav-label">SEGUIMIENTO</div>
          <div class="nav-group">
            <router-link to="/calendario" class="nav-item">
              <span class="nav-icon">📅</span> Calendario
            </router-link>
            <router-link to="/rankings" class="nav-item">
              <span class="nav-icon">📈</span> Rankings
            </router-link>
          </div>

          <div v-if="auth.esAdmin" class="nav-label">SISTEMA</div>
          <div v-if="auth.esAdmin" class="nav-group">
            <router-link to="/usuarios" class="nav-item">
              <span class="nav-icon">👥</span> Usuarios
            </router-link>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="profile-card">
          <div class="avatar">{{ auth.usuario?.nombre?.charAt(0) || 'U' }}</div>
          <div class="profile-info">
            <div class="profile-name">{{ auth.usuario?.nombre || 'Usuario' }}</div>
            <div class="profile-role">{{ auth.usuario?.rol === 'admin' ? 'Administrador' : 'Entrenador' }}</div>
          </div>
          <button class="logout-btn" @click="handleLogout" title="Cerrar sesión">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content" :class="{ 'full-width': !mostrarLayout }">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container.no-layout {
  display: block;
}

.main-content.full-width {
  padding: 0;
  max-width: none;
  margin: 0;
}

.sidebar {
  width: 280px;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 1.5rem 0.75rem;
  z-index: 95;
}

/* Header para móviles oculto por defecto */
.mobile-header {
  display: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0.75rem 1rem;
}

.brand.desktop-only {
  padding-bottom: 2.5rem;
}

.brand-bolt {
  width: 32px;
  height: 32px;
  background: var(--color-accent-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.bolt-svg {
  width: 18px;
  height: 18px;
}

.brand-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-text-primary);
}

.text-indigo {
  color: var(--color-accent-primary);
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1.5rem 1rem 0.5rem;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  filter: grayscale(1);
  transition: filter 0.2s;
}

.nav-item:hover {
  background: var(--color-bg-elevated);
  padding-left: 1.25rem;
  color: var(--color-text-primary);
}

.nav-item:hover .nav-icon {
  filter: grayscale(0);
}

.nav-item.router-link-active {
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-accent-primary);
  font-weight: 600;
  padding-left: 1.25rem;
  box-shadow: inset 3px 0 0 var(--color-accent-primary);
}

.nav-item.router-link-active .nav-icon {
  filter: grayscale(0);
}

.sidebar-top {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

/* Scrollbar styling */
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

.sidebar-footer {
  padding-top: 1rem;
  margin-top: auto;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  position: relative;
}

.avatar {
  width: 32px;
  height: 32px;
  background: var(--color-accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  color: white;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.logout-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  padding: 0.4rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(244, 63, 94, 0.1);
  color: var(--color-danger);
}

.logout-btn svg {
  width: 18px;
  height: 18px;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
    padding: 0 1rem;
    height: 64px;
    align-items: center;
    justify-content: space-between;
    background: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .desktop-only {
    display: none;
  }

  .menu-toggle {
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-svg {
    width: 24px;
    height: 24px;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 280px;
    height: 100vh;
    border-right: 1px solid var(--color-border);
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 110;
  }

  .sidebar.open {
    left: 0;
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 105;
    animation: fadeIn 0.2s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.page-fade-leave-to {
  opacity: 0;
}
</style>
