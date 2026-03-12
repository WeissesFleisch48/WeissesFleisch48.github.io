import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SesionEntrenamiento, EntrenamientoEjercicio } from '../../core/domain/entities';
import { sesionUseCases } from '../../infrastructure/di';

export const useSesionesStore = defineStore('sesiones', () => {
  const sesiones = ref<SesionEntrenamiento[]>([]);
  const cargando = ref(false);

  async function cargar() {
    cargando.value = true;
    sesiones.value = await sesionUseCases.obtenerTodas();
    cargando.value = false;
  }

  async function crear(datos: Omit<SesionEntrenamiento, 'id' | 'creadoEn'>) {
    const nueva = await sesionUseCases.crear(datos);
    sesiones.value.push(nueva);
    return nueva;
  }

  async function actualizar(id: string, datos: Partial<Omit<SesionEntrenamiento, 'id' | 'creadoEn'>>) {
    const actualizada = await sesionUseCases.actualizar(id, datos);
    const idx = sesiones.value.findIndex(s => s.id === id);
    if (idx >= 0) sesiones.value[idx] = actualizada;
    return actualizada;
  }

  async function agregarEjercicioASesion(sesionId: string, ejercicio: EntrenamientoEjercicio) {
    const actualizada = await sesionUseCases.agregarEjercicio(sesionId, ejercicio);
    const idx = sesiones.value.findIndex(s => s.id === sesionId);
    if (idx >= 0) sesiones.value[idx] = actualizada;
    return actualizada;
  }

  async function quitarEjercicioDeSesion(sesionId: string, ejercicioId: string) {
    const actualizada = await sesionUseCases.quitarEjercicio(sesionId, ejercicioId);
    const idx = sesiones.value.findIndex(s => s.id === sesionId);
    if (idx >= 0) sesiones.value[idx] = actualizada;
    return actualizada;
  }

  async function eliminar(id: string) {
    await sesionUseCases.eliminar(id);
    sesiones.value = sesiones.value.filter(s => s.id !== id);
  }

  const porId = computed(() => (id: string) => sesiones.value.find(s => s.id === id));
  const porMes = computed(() => (añoMes: string) => sesiones.value.filter(s => s.fecha.startsWith(añoMes)));

  return { 
    sesiones, 
    cargando, 
    cargar, 
    crear, 
    actualizar, 
    agregarEjercicioASesion,
    quitarEjercicioDeSesion,
    eliminar, 
    porId, 
    porMes 
  };
});
