import type { IResultadoEjercicioRepository } from '../../domain/ports';
import type { ResultadoEjercicio } from '../../domain/entities';
import { generarId } from '../../../infrastructure/utils/id';

export class ResultadoEjercicioUseCases {
  constructor(private readonly repo: IResultadoEjercicioRepository) {}

  async obtenerTodos(): Promise<ResultadoEjercicio[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<ResultadoEjercicio | null> {
    return this.repo.findById(id);
  }

  async obtenerPorSesion(sesionId: string): Promise<ResultadoEjercicio[]> {
    return this.repo.findBySesion(sesionId);
  }

  async obtenerPorJugador(jugadorId: string): Promise<ResultadoEjercicio[]> {
    return this.repo.findByJugador(jugadorId);
  }

  async obtenerPorEjercicio(ejercicioId: string): Promise<ResultadoEjercicio[]> {
    return this.repo.findByEjercicio(ejercicioId);
  }

  async registrar(datos: Omit<ResultadoEjercicio, 'id' | 'creadoEn'>): Promise<ResultadoEjercicio> {
    // Si ya existe un resultado para este jugador/ejercicio/sesión, lo actualiza
    const todos = await this.repo.findBySesion(datos.sesionId);
    const existente = todos.find(
      r => r.jugadorId === datos.jugadorId && r.ejercicioId === datos.ejercicioId
    );
    if (existente) {
      const actualizado = { ...existente, valores: datos.valores };
      await this.repo.save(actualizado);
      return actualizado;
    }
    const resultado: ResultadoEjercicio = {
      ...datos,
      id: generarId(),
      creadoEn: new Date().toISOString(),
    };
    await this.repo.save(resultado);
    return resultado;
  }

  async eliminar(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
