import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CategoriaEjercicio } from '../../core/domain/entities';
import { categoriaUseCases } from '../../infrastructure/di';

export const useCategoriasStore = defineStore('categorias', () => {
  const categorias = ref<CategoriaEjercicio[]>([]);
  const cargando = ref(false);

  async function cargar() {
    cargando.value = true;
    categorias.value = await categoriaUseCases.obtenerTodas();
    cargando.value = false;
  }

  async function crear(datos: Omit<CategoriaEjercicio, 'id' | 'creadoEn'>) {
    const nueva = await categoriaUseCases.crear(datos);
    categorias.value.push(nueva);
    return nueva;
  }

  async function actualizar(id: string, datos: Partial<Omit<CategoriaEjercicio, 'id' | 'creadoEn'>>) {
    const actualizada = await categoriaUseCases.actualizar(id, datos);
    const idx = categorias.value.findIndex(c => c.id === id);
    if (idx >= 0) categorias.value[idx] = actualizada;
    return actualizada;
  }

  async function eliminar(id: string) {
    await categoriaUseCases.eliminar(id);
    categorias.value = categorias.value.filter(c => c.id !== id);
  }

  const porId = computed(() => (id: string) => categorias.value.find(c => c.id === id));

  return { categorias, cargando, cargar, crear, actualizar, eliminar, porId };
});
