<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEjerciciosStore } from '../stores/ejercicios'
import { useCategoriasStore } from '../stores/categorias'
import type { Ejercicio, Metrica } from '../../core/domain/entities'

const store = useEjerciciosStore()
const categoriasStore = useCategoriasStore()

const showModal = ref(false)
const ejercicioEditando = ref<Ejercicio | null>(null)
const categoriaFiltro = ref<string>('')

const form = ref({
  nombre: '',
  descripcion: '',
  categoriaId: '',
  metricas: [] as Omit<Metrica, 'id'>[]
})

const nuevaMetrica = ref({
  nombre: '',
  unidad: '',
  mayorEsMejor: true
})

const ejerciciosFiltrados = computed(() => {
  if (!categoriaFiltro.value) return store.ejercicios
  return store.porCategoria(categoriaFiltro.value)
})

function abrirModal(ejercicio?: Ejercicio) {
  if (ejercicio) {
    ejercicioEditando.value = ejercicio
    form.value = {
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion,
      categoriaId: ejercicio.categoriaId,
      // Clonamos para no mutar el store directamente
      metricas: ejercicio.metricas.map(m => ({ ...m }))
    }
  } else {
    ejercicioEditando.value = null
    form.value = {
      nombre: '',
      descripcion: '',
      categoriaId: categoriaFiltro.value || '',
      metricas: []
    }
  }
  nuevaMetrica.value = { nombre: '', unidad: '', mayorEsMejor: true }
  showModal.value = true
}

function agregarMetrica() {
  if (!nuevaMetrica.value.nombre || !nuevaMetrica.value.unidad) return
  form.value.metricas.push({ ...nuevaMetrica.value })
  nuevaMetrica.value = { nombre: '', unidad: '', mayorEsMejor: true }
}

function quitarMetrica(index: number) {
  form.value.metricas.splice(index, 1)
}

async function guardar() {
  if (form.value.metricas.length === 0) {
    alert('Debes agregar al menos una métrica para este ejercicio')
    return
  }

  if (ejercicioEditando.value) {
    await store.actualizar(ejercicioEditando.value.id, form.value)
  } else {
    await store.crear(form.value as any)
  }
  showModal.value = false
}

async function eliminar(id: string) {
  if (confirm('¿Eliminar este ejercicio? Se perderán todos los resultados previos.')) {
    await store.eliminar(id)
  }
}

function nombreCategoria(id: string) {
  return categoriasStore.porId(id)?.nombre || 'Sin categoría'
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Ejercicios</h1>
      <div style="display: flex; gap: 1rem;">
        <select v-model="categoriaFiltro" class="form-select" style="width: 250px;">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categoriasStore.categorias" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
        <button class="btn btn-primary" @click="abrirModal()" :disabled="categoriasStore.categorias.length === 0">
          + Nuevo Ejercicio
        </button>
      </div>
    </div>

    <div v-if="categoriasStore.categorias.length === 0" class="card" style="text-align: center; padding: 3rem;">
      <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
        Necesitas crear al menos una categoría antes de poder agregar ejercicios.
      </p>
      <router-link to="/categorias" class="btn btn-primary">Ir a Categorías</router-link>
    </div>

    <div v-else class="grid grid-cols-2">
      <div v-for="ejercicio in ejerciciosFiltrados" :key="ejercicio.id" class="card fade-in">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="margin-bottom: 0.25rem;">{{ ejercicio.nombre }}</h3>
            <span class="badge badge-emerald">{{ nombreCategoria(ejercicio.categoriaId) }}</span>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" @click="abrirModal(ejercicio)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="eliminar(ejercicio.id)">Eliminar</button>
          </div>
        </div>
        
        <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin: 1rem 0;">
          {{ ejercicio.descripcion || 'Sin descripción' }}
        </p>

        <div class="metricas-list">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 0.5rem; font-weight: 700;">
            Métricas medidas:
          </div>
          <div v-for="m in ejercicio.metricas" :key="m.id || m.nombre" class="metrica-item">
            <span class="metrica-name">{{ m.nombre }}</span>
            <span class="metrica-unit">({{ m.unidad }})</span>
            <span class="metrica-direction" :class="m.mayorEsMejor ? 'is-better-up' : 'is-better-down'">
              {{ m.mayorEsMejor ? 'Rendimiento: Alto' : 'Rendimiento: Bajo' }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="ejerciciosFiltrados.length === 0" class="empty-state">
        <p>No hay ejercicios en esta categoría aún.</p>
        <button class="btn btn-primary" @click="abrirModal()">Crear el primer ejercicio</button>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h2>{{ ejercicioEditando ? 'Editar Ejercicio' : 'Nuevo Ejercicio' }}</h2>
        
        <form @submit.prevent="guardar" style="margin-top: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Nombre del Ejercicio</label>
            <input v-model="form.nombre" type="text" class="form-input" required placeholder="Ej. Sprint 40m, Sentadilla..." />
          </div>

          <div class="form-group">
            <label class="form-label">Categoría</label>
            <select v-model="form.categoriaId" class="form-select" required>
              <option value="" disabled>Seleccionar categoría...</option>
              <option v-for="cat in categoriasStore.categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-input" rows="2"></textarea>
          </div>

          <div class="metricas-builder">
            <h3 style="font-size: 1rem; margin-bottom: 1rem;">Métricas a Evaluar</h3>
            
            <div class="metricas-added" v-if="form.metricas.length > 0">
              <div v-for="(m, idx) in form.metricas" :key="idx" class="metrica-row">
                <div>
                  <strong>{{ m.nombre }}</strong> <span style="color: var(--color-text-secondary)">({{ m.unidad }})</span>
                  <div style="font-size: 0.75rem; color: var(--color-text-secondary);">
                    {{ m.mayorEsMejor ? 'Valor más alto = mejor rendimiento' : 'Valor más bajo = mejor rendimiento' }}
                  </div>
                </div>
                <button type="button" class="btn btn-danger btn-sm" @click="quitarMetrica(idx)">Quitar</button>
              </div>
            </div>
            <div v-else style="color: var(--color-danger); font-size: 0.875rem; margin-bottom: 1rem;">
              Debes configurar al menos una métrica para este ejercicio.
            </div>

            <div class="metrica-form card" style="background: var(--color-bg-elevated); padding: 1rem; border-color: var(--color-border);">
              <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Agregar nueva métrica</div>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input v-model="nuevaMetrica.nombre" type="text" class="form-input" placeholder="Nombre (Ej. Tiempo, Reps)" style="flex: 2" />
                <input v-model="nuevaMetrica.unidad" type="text" class="form-input" placeholder="Unidad (Ej. seg, kg)" style="flex: 1" />
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer;">
                  <input v-model="nuevaMetrica.mayorEsMejor" type="checkbox" />
                  Mayor valor indica mejor rendimiento
                </label>
                <button type="button" class="btn btn-secondary btn-sm" @click="agregarMetrica" :disabled="!nuevaMetrica.nombre || !nuevaMetrica.unidad">
                  Añadir Métrica
                </button>
              </div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="form.metricas.length === 0">Guardar Ejercicio</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.metricas-list {
  background: var(--color-bg-base);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-top: 1rem;
}

.metrica-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}
.metrica-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metrica-name { font-weight: 500; }
.metrica-unit { color: var(--color-text-secondary); font-size: 0.875rem; }
.metrica-direction { 
  margin-left: auto; 
  font-size: 0.75rem; 
  padding: 0.2rem 0.5rem; 
  border-radius: var(--radius-sm);
}
.is-better-up { background: rgba(16, 185, 129, 0.1); color: var(--color-accent-secondary); }
.is-better-down { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }

.metricas-builder {
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.metrica-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
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

.btn-sm { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
