import type { ICategoriaEjercicioRepository } from '../../domain/ports';
import type { CategoriaEjercicio } from '../../domain/entities';
import { generarId } from '../../../infrastructure/utils/id';

export class CategoriaEjercicioUseCases {
  constructor(private readonly repo: ICategoriaEjercicioRepository) {}

  async obtenerTodas(): Promise<CategoriaEjercicio[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<CategoriaEjercicio | null> {
    return this.repo.findById(id);
  }

  async crear(datos: Omit<CategoriaEjercicio, 'id' | 'creadoEn'>): Promise<CategoriaEjercicio> {
    const categoria: CategoriaEjercicio = {
      ...datos,
      id: generarId(),
      creadoEn: new Date().toISOString(),
    };
    await this.repo.save(categoria);
    return categoria;
  }

  async actualizar(id: string, datos: Partial<Omit<CategoriaEjercicio, 'id' | 'creadoEn'>>): Promise<CategoriaEjercicio> {
    const existente = await this.repo.findById(id);
    if (!existente) throw new Error(`Categoría con id ${id} no encontrada`);
    const actualizada = { ...existente, ...datos };
    await this.repo.save(actualizada);
    return actualizada;
  }

  async eliminar(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
