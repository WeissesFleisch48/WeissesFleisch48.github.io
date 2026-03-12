<script setup lang="ts">
import { ref } from 'vue'
import { useCategoriasStore } from '../stores/categorias'
import type { CategoriaEjercicio } from '../../core/domain/entities'

const store = useCategoriasStore()
const showModal = ref(false)
const categoriaEditando = ref<CategoriaEjercicio | null>(null)

const form = ref({
  nombre: '',
  descripcion: '',
  color: '#fcba03'
})

function abrirModal(categoria?: CategoriaEjercicio) {
  if (categoria) {
    categoriaEditando.value = categoria
    form.value = { nombre: categoria.nombre, descripcion: categoria.descripcion, color: categoria.color }
  } else {
    categoriaEditando.value = null
    form.value = { nombre: '', descripcion: '', color: '#fcba03' }
  }
  showModal.value = true
}

async function guardar() {
  if (categoriaEditando.value) {
    await store.actualizar(categoriaEditando.value.id, form.value)
  } else {
    await store.crear(form.value)
  }
  showModal.value = false
}

async function eliminar(id: string) {
  if (confirm('¿Eliminar esta categoría? Esto podría afectar a los ejercicios asociados.')) {
    await store.eliminar(id)
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Categorías de Ejercicios</h1>
      <button class="btn btn-primary" @click="abrirModal()">+ Nueva Categoría</button>
    </div>

    <div class="grid grid-cols-3">
      <div v-for="cat in store.categorias" :key="cat.id" class="card fade-in">
        <div class="cat-header">
          <div class="cat-color" :style="{ backgroundColor: cat.color }"></div>
          <h3>{{ cat.nombre }}</h3>
        </div>
        <p class="cat-desc">{{ cat.descripcion || 'Sin descripción' }}</p>
        
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm" @click="abrirModal(cat)">Editar</button>
          <button class="btn btn-danger btn-sm" @click="eliminar(cat.id)">Eliminar</button>
        </div>
      </div>

      <div v-if="store.categorias.length === 0" class="empty-state">
        <p>No hay categorías registradas.</p>
        <button class="btn btn-primary" @click="abrirModal()">Crear primera categoría</button>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h2>{{ categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
        
        <form @submit.prevent="guardar" style="margin-top: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Nombre de Categoría</label>
            <input v-model="form.nombre" type="text" class="form-input" required placeholder="Ej. Fuerza, Velocidad..." />
          </div>
          
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-input" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Color representativo</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <input v-model="form.color" type="color" class="color-picker" />
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
.cat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cat-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.cat-desc {
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

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
}

.fade-in {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
