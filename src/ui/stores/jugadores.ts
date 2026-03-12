import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Jugador } from '../../core/domain/entities';
import { jugadorUseCases } from '../../infrastructure/di';

export const useJugadoresStore = defineStore('jugadores', () => {
  const jugadores = ref<Jugador[]>([]);
  const cargando = ref(false);

  async function cargar() {
    cargando.value = true;
    jugadores.value = await jugadorUseCases.obtenerTodos();
    cargando.value = false;
  }

  async function crear(datos: Omit<Jugador, 'id' | 'creadoEn'>) {
    const nuevo = await jugadorUseCases.crear(datos);
    jugadores.value.push(nuevo);
    return nuevo;
  }

  async function actualizar(id: string, datos: Partial<Omit<Jugador, 'id' | 'creadoEn'>>) {
    const actualizado = await jugadorUseCases.actualizar(id, datos);
    const idx = jugadores.value.findIndex(j => j.id === id);
    if (idx >= 0) jugadores.value[idx] = actualizado;
    return actualizado;
  }

  async function eliminar(id: string) {
    await jugadorUseCases.eliminar(id);
    jugadores.value = jugadores.value.filter(j => j.id !== id);
  }

  const porId = computed(() => (id: string) => jugadores.value.find(j => j.id === id));
  const porEquipo = computed(() => (equipoId: string) => jugadores.value.filter(j => j.equipoId === equipoId));

  return { jugadores, cargando, cargar, crear, actualizar, eliminar, porId, porEquipo };
});
