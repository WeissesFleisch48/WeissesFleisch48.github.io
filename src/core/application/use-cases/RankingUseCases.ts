import type {
  ICategoriaEjercicioRepository,
  IEjercicioRepository,
  IEquipoRepository,
  IJugadorRepository,
  IResultadoEjercicioRepository,
} from '../../domain/ports';
import type {
  RankingEquipo,
  RankingCategoria,
  PuntuacionJugador,
} from '../../domain/entities';

export class RankingUseCases {
  private readonly categoriaRepo: ICategoriaEjercicioRepository;
  private readonly ejercicioRepo: IEjercicioRepository;
  private readonly equipoRepo: IEquipoRepository;
  private readonly jugadorRepo: IJugadorRepository;
  private readonly resultadoRepo: IResultadoEjercicioRepository;

  constructor(
    categoriaRepo: ICategoriaEjercicioRepository,
    ejercicioRepo: IEjercicioRepository,
    equipoRepo: IEquipoRepository,
    jugadorRepo: IJugadorRepository,
    resultadoRepo: IResultadoEjercicioRepository
  ) {
    this.categoriaRepo = categoriaRepo;
    this.ejercicioRepo = ejercicioRepo;
    this.equipoRepo = equipoRepo;
    this.jugadorRepo = jugadorRepo;
    this.resultadoRepo = resultadoRepo;
  }

  // Calcula una puntuación normalizada [0-100] para un conjunto de valores de métricas
  private calcularPuntaje(_ejercicioId: string, valores: { metricaId: string; valor: number }[], _metricas: { id: string; mayorEsMejor: boolean }[]): number {
    if (valores.length === 0) return 0;
    // Por ahora la puntuación es el promedio de los valores numéricos
    // En el futuro se puede ponderar por importancia de métrica
    const suma = valores.reduce((acc, v) => acc + v.valor, 0);
    return suma / valores.length;
  }

  async getRankingEquipos(ejercicioId?: string): Promise<RankingEquipo[]> {
    const equipos = await this.equipoRepo.findAll();
    const jugadores = await this.jugadorRepo.findAll();
    const resultados = await this.resultadoRepo.findAll();
    const ejercicios = await this.ejercicioRepo.findAll();

    const resultadosFiltrados = ejercicioId
      ? resultados.filter(r => r.ejercicioId === ejercicioId)
      : resultados;

    const ranking: RankingEquipo[] = equipos.map(equipo => {
      const jugadoresEquipo = jugadores.filter(j => j.equipoId === equipo.id);
      const jugadoresIds = new Set(jugadoresEquipo.map(j => j.id));
      const resultadosEquipo = resultadosFiltrados.filter(r => jugadoresIds.has(r.jugadorId));

      let totalPuntaje = 0;
      let totalRegistros = resultadosEquipo.length;

      resultadosEquipo.forEach(r => {
        const ejercicio = ejercicios.find(e => e.id === r.ejercicioId);
        const metricas = ejercicio?.metricas ?? [];
        totalPuntaje += this.calcularPuntaje(r.ejercicioId, r.valores, metricas);
      });

      return {
        equipo,
        promedio: totalRegistros > 0 ? totalPuntaje / totalRegistros : 0,
        totalJugadores: jugadoresEquipo.length,
        totalRegistros,
      };
    });

    return ranking.sort((a, b) => b.promedio - a.promedio);
  }

  async getRankingCategorias(equipoId?: string): Promise<RankingCategoria[]> {
    const categorias = await this.categoriaRepo.findAll();
    const ejercicios = await this.ejercicioRepo.findAll();
    const jugadores = await this.jugadorRepo.findAll();
    const resultados = await this.resultadoRepo.findAll();

    const jugadoresIds = equipoId
      ? new Set(jugadores.filter(j => j.equipoId === equipoId).map(j => j.id))
      : new Set(jugadores.map(j => j.id));

    const resultadosFiltrados = resultados.filter(r => jugadoresIds.has(r.jugadorId));

    const ranking: RankingCategoria[] = categorias.map(categoria => {
      const ejerciciosCategoria = ejercicios.filter(e => e.categoriaId === categoria.id);
      const ejerciciosIds = new Set(ejerciciosCategoria.map(e => e.id));
      const resultadosCategoria = resultadosFiltrados.filter(r => ejerciciosIds.has(r.ejercicioId));

      let totalPuntaje = 0;
      const totalRegistros = resultadosCategoria.length;

      resultadosCategoria.forEach(r => {
        const ejercicio = ejerciciosCategoria.find(e => e.id === r.ejercicioId);
        const metricas = ejercicio?.metricas ?? [];
        totalPuntaje += this.calcularPuntaje(r.ejercicioId, r.valores, metricas);
      });

      return {
        categoria,
        promedio: totalRegistros > 0 ? totalPuntaje / totalRegistros : 0,
        totalRegistros,
      };
    });

    return ranking.sort((a, b) => b.promedio - a.promedio);
  }

  async getRankingJugadores(equipoId?: string, ejercicioId?: string): Promise<PuntuacionJugador[]> {
    const jugadores = await this.jugadorRepo.findAll();
    const ejercicios = await this.ejercicioRepo.findAll();
    const resultados = await this.resultadoRepo.findAll();

    const jugadoresFiltrados = equipoId
      ? jugadores.filter(j => j.equipoId === equipoId)
      : jugadores;

    const resultadosFiltrados = ejercicioId
      ? resultados.filter(r => r.ejercicioId === ejercicioId)
      : resultados;

    const ranking: PuntuacionJugador[] = jugadoresFiltrados.map(jugador => {
      const resultadosJugador = resultadosFiltrados.filter(r => r.jugadorId === jugador.id);

      let totalPuntaje = 0;
      resultadosJugador.forEach(r => {
        const ejercicio = ejercicios.find(e => e.id === r.ejercicioId);
        const metricas = ejercicio?.metricas ?? [];
        totalPuntaje += this.calcularPuntaje(r.ejercicioId, r.valores, metricas);
      });

      return {
        jugador,
        promedio: resultadosJugador.length > 0 ? totalPuntaje / resultadosJugador.length : 0,
        totalRegistros: resultadosJugador.length,
      };
    });

    return ranking.sort((a, b) => b.promedio - a.promedio);
  }
}
