import type { IEjercicioRepository } from '../../domain/ports';
import type { Ejercicio, Metrica } from '../../domain/entities';
import { generarId } from '../../../infrastructure/utils/id';

export class EjercicioUseCases {
  private readonly repo: IEjercicioRepository;

  constructor(repo: IEjercicioRepository) {
    this.repo = repo;
  }

  async obtenerTodos(): Promise<Ejercicio[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<Ejercicio | null> {
    return this.repo.findById(id);
  }

  async obtenerPorCategoria(categoriaId: string): Promise<Ejercicio[]> {
    return this.repo.findByCategoria(categoriaId);
  }

  async crear(datos: Omit<Ejercicio, 'id' | 'creadoEn'>): Promise<Ejercicio> {
    const ejercicio: Ejercicio = {
      ...datos,
      metricas: datos.metricas.map(m => ({ ...m, id: m.id || generarId() })),
      id: generarId(),
      creadoEn: new Date().toISOString(),
    };
    await this.repo.save(ejercicio);
    return ejercicio;
  }

  async actualizar(id: string, datos: Partial<Omit<Ejercicio, 'id' | 'creadoEn'>>): Promise<Ejercicio> {
    const existente = await this.repo.findById(id);
    if (!existente) throw new Error(`Ejercicio con id ${id} no encontrado`);
    const actualizado = { ...existente, ...datos };
    await this.repo.save(actualizado);
    return actualizado;
  }

  async agregarMetrica(ejercicioId: string, metrica: Omit<Metrica, 'id'>): Promise<Ejercicio> {
    const ejercicio = await this.repo.findById(ejercicioId);
    if (!ejercicio) throw new Error(`Ejercicio con id ${ejercicioId} no encontrado`);
    const nuevaMetrica: Metrica = { ...metrica, id: generarId() };
    ejercicio.metricas.push(nuevaMetrica);
    await this.repo.save(ejercicio);
    return ejercicio;
  }

  async eliminar(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
