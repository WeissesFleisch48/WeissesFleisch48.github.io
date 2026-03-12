import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Ejercicio } from '../../core/domain/entities';
import { ejercicioUseCases } from '../../infrastructure/di';

export const useEjerciciosStore = defineStore('ejercicios', () => {
  const ejercicios = ref<Ejercicio[]>([]);
  const cargando = ref(false);

  async function cargar() {
    cargando.value = true;
    ejercicios.value = await ejercicioUseCases.obtenerTodos();
    cargando.value = false;
  }

  async function crear(datos: Omit<Ejercicio, 'id' | 'creadoEn'>) {
    const nuevo = await ejercicioUseCases.crear(datos);
    ejercicios.value.push(nuevo);
    return nuevo;
  }

  async function actualizar(id: string, datos: Partial<Omit<Ejercicio, 'id' | 'creadoEn'>>) {
    const actualizado = await ejercicioUseCases.actualizar(id, datos);
    const idx = ejercicios.value.findIndex(e => e.id === id);
    if (idx >= 0) ejercicios.value[idx] = actualizado;
    return actualizado;
  }

  async function eliminar(id: string) {
    await ejercicioUseCases.eliminar(id);
    ejercicios.value = ejercicios.value.filter(e => e.id !== id);
  }

  const porId = computed(() => (id: string) => ejercicios.value.find(e => e.id === id));
  const porCategoria = computed(() => (categoriaId: string) => ejercicios.value.filter(e => e.categoriaId === categoriaId));

  return { ejercicios, cargando, cargar, crear, actualizar, eliminar, porId, porCategoria };
});
