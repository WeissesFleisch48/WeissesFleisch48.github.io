import type { IJugadorRepository } from '../../domain/ports';
import type { Jugador } from '../../domain/entities';
import { generarId } from '../../../infrastructure/utils/id';

export class JugadorUseCases {
  constructor(private readonly repo: IJugadorRepository) {}

  async obtenerTodos(): Promise<Jugador[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<Jugador | null> {
    return this.repo.findById(id);
  }

  async obtenerPorEquipo(equipoId: string): Promise<Jugador[]> {
    return this.repo.findByEquipo(equipoId);
  }

  async crear(datos: Omit<Jugador, 'id' | 'creadoEn'>): Promise<Jugador> {
    const jugador: Jugador = {
      ...datos,
      id: generarId(),
      creadoEn: new Date().toISOString(),
    };
    await this.repo.save(jugador);
    return jugador;
  }

  async actualizar(id: string, datos: Partial<Omit<Jugador, 'id' | 'creadoEn'>>): Promise<Jugador> {
    const existente = await this.repo.findById(id);
    if (!existente) throw new Error(`Jugador con id ${id} no encontrado`);
    const actualizado = { ...existente, ...datos };
    await this.repo.save(actualizado);
    return actualizado;
  }

  async eliminar(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
