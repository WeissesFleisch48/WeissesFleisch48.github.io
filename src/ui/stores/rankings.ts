import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RankingEquipo, RankingCategoria, PuntuacionJugador } from '../../core/domain/entities';
import { rankingUseCases } from '../../infrastructure/di';

export const useRankingsStore = defineStore('rankings', () => {
  const rankingEquipos = ref<RankingEquipo[]>([]);
  const rankingCategorias = ref<RankingCategoria[]>([]);
  const rankingJugadores = ref<PuntuacionJugador[]>([]);
  const cargando = ref(false);

  async function cargarRankingEquipos(ejercicioId?: string) {
    cargando.value = true;
    rankingEquipos.value = await rankingUseCases.getRankingEquipos(ejercicioId);
    cargando.value = false;
  }

  async function cargarRankingCategorias(equipoId?: string) {
    cargando.value = true;
    rankingCategorias.value = await rankingUseCases.getRankingCategorias(equipoId);
    cargando.value = false;
  }

  async function cargarRankingJugadores(equipoId?: string, ejercicioId?: string) {
    cargando.value = true;
    rankingJugadores.value = await rankingUseCases.getRankingJugadores(equipoId, ejercicioId);
    cargando.value = false;
  }

  return {
    rankingEquipos,
    rankingCategorias,
    rankingJugadores,
    cargando,
    cargarRankingEquipos,
    cargarRankingCategorias,
    cargarRankingJugadores
  };
});
