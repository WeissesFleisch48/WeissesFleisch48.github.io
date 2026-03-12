import type { IEquipoRepository } from '../../domain/ports';
import type { Equipo } from '../../domain/entities';
import { generarId } from '../../../infrastructure/utils/id';

export class EquipoUseCases {
  constructor(private readonly repo: IEquipoRepository) {}

  async obtenerTodos(): Promise<Equipo[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<Equipo | null> {
    return this.repo.findById(id);
  }

  async crear(datos: Omit<Equipo, 'id' | 'creadoEn'>): Promise<Equipo> {
    const equipo: Equipo = {
      ...datos,
      id: generarId(),
      creadoEn: new Date().toISOString(),
    };
    await this.repo.save(equipo);
    return equipo;
  }

  async actualizar(id: string, datos: Partial<Omit<Equipo, 'id' | 'creadoEn'>>): Promise<Equipo> {
    const existente = await this.repo.findById(id);
    if (!existente) throw new Error(`Equipo con id ${id} no encontrado`);
    const actualizado = { ...existente, ...datos };
    await this.repo.save(actualizado);
    return actualizado;
  }

  async eliminar(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
