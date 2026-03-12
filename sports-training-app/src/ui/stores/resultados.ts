import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ResultadoEjercicio } from '../../core/domain/entities';
import { resultadoUseCases } from '../../infrastructure/di';

export const useResultadosStore = defineStore('resultados', () => {
  const resultados = ref<ResultadoEjercicio[]>([]);
  const cargando = ref(false);

  async function cargar() {
    cargando.value = true;
    resultados.value = await resultadoUseCases.obtenerTodos();
    cargando.value = false;
  }

  async function registrar(datos: Omit<ResultadoEjercicio, 'id' | 'creadoEn'>) {
    const nuevo = await resultadoUseCases.registrar(datos);
    // Actualizar si ya existe (upsert local)
    const idx = resultados.value.findIndex(r => r.id === nuevo.id);
    if (idx >= 0) {
      resultados.value[idx] = nuevo;
    } else {
      resultados.value.push(nuevo);
    }
    return nuevo;
  }

  async function eliminar(id: string) {
    await resultadoUseCases.eliminar(id);
    resultados.value = resultados.value.filter(r => r.id !== id);
  }

  const porSesion = computed(() => (sesionId: string) => resultados.value.filter(r => r.sesionId === sesionId));
  const porEjercicioEnSesion = computed(() => (sesionId: string, ejercicioId: string) => 
    resultados.value.filter(r => r.sesionId === sesionId && r.ejercicioId === ejercicioId)
  );

  return { resultados, cargando, cargar, registrar, eliminar, porSesion, porEjercicioEnSesion };
});
