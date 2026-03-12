<script setup lang="ts">
import { ref } from 'vue'
import { useEquiposStore } from '../stores/equipos'
import type { Equipo } from '../../core/domain/entities'

const store = useEquiposStore()
const showModal = ref(false)
const equipoEditando = ref<Equipo | null>(null)

const form = ref({
  nombre: '',
  descripcion: '',
  color: '#06b6d4'
})

function abrirModal(equipo?: Equipo) {
  if (equipo) {
    equipoEditando.value = equipo
    form.value = { nombre: equipo.nombre, descripcion: equipo.descripcion, color: equipo.color }
  } else {
    equipoEditando.value = null
    form.value = { nombre: '', descripcion: '', color: '#06b6d4' }
  }
  showModal.value = true
}

async function guardar() {
  if (equipoEditando.value) {
    await store.actualizar(equipoEditando.value.id, form.value)
  } else {
    await store.crear(form.value)
  }
  showModal.value = false
}

async function eliminar(id: string) {
  if (confirm('¿Estás seguro de eliminar este equipo? Todos sus jugadores y resultados asociados podrían verse afectados.')) {
    await store.eliminar(id)
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Equipos</h1>
      <button class="btn btn-primary" @click="abrirModal()">+ Nuevo Equipo</button>
    </div>

    <div class="grid grid-cols-3">
      <div v-for="equipo in store.equipos" :key="equipo.id" class="card fade-in">
        <div class="equipo-header">
          <div class="equipo-color" :style="{ backgroundColor: equipo.color }"></div>
          <h3>{{ equipo.nombre }}</h3>
        </div>
        <p class="equipo-desc">{{ equipo.descripcion || 'Sin descripción' }}</p>
        
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm" @click="abrirModal(equipo)">Editar</button>
          <button class="btn btn-danger btn-sm" @click="eliminar(equipo.id)">Eliminar</button>
        </div>
      </div>
      
      <div v-if="store.equipos.length === 0" class="empty-state">
        <p>No hay equipos registrados aún.</p>
        <button class="btn btn-primary" @click="abrirModal()">Crear el primer equipo</button>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h2>{{ equipoEditando ? 'Editar Equipo' : 'Nuevo Equipo' }}</h2>
        
        <form @submit.prevent="guardar" style="margin-top: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Nombre del Equipo</label>
            <input v-model="form.nombre" type="text" class="form-input" required placeholder="Ej. Titanes FC" />
          </div>
          
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-input" rows="3" placeholder="Breve descripción del equipo..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Color representativo</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <input v-model="form.color" type="color" class="color-picker" />
              <span>{{ form.color }}</span>
            </div>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.equipo-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.equipo-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--color-bg-card), 0 0 0 4px var(--color-border);
}

.equipo-desc {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  min-height: 2.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.color-picker {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.color-picker::-webkit-color-swatch {
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
}

.color-picker::-moz-color-swatch {
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
}

.empty-state p {
  margin-bottom: 1rem;
}

.fade-in {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
