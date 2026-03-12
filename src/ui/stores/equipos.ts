import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Equipo } from '../../core/domain/entities';
import { equipoUseCases } from '../../infrastructure/di';

export const useEquiposStore = defineStore('equipos', () => {
  const equipos = ref<Equipo[]>([]);
  const cargando = ref(false);

  async function cargar() {
    cargando.value = true;
    equipos.value = await equipoUseCases.obtenerTodos();
    cargando.value = false;
  }

  async function crear(datos: Omit<Equipo, 'id' | 'creadoEn'>) {
    const nuevo = await equipoUseCases.crear(datos);
    equipos.value.push(nuevo);
    return nuevo;
  }

  async function actualizar(id: string, datos: Partial<Omit<Equipo, 'id' | 'creadoEn'>>) {
    const actualizado = await equipoUseCases.actualizar(id, datos);
    const idx = equipos.value.findIndex(e => e.id === id);
    if (idx >= 0) equipos.value[idx] = actualizado;
    return actualizado;
  }

  async function eliminar(id: string) {
    await equipoUseCases.eliminar(id);
    equipos.value = equipos.value.filter(e => e.id !== id);
  }

  const porId = computed(() => (id: string) => equipos.value.find(e => e.id === id));

  return { equipos, cargando, cargar, crear, actualizar, eliminar, porId };
});
