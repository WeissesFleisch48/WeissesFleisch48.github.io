import type { ISesionEntrenamientoRepository } from '../../domain/ports';
import type { SesionEntrenamiento, EntrenamientoEjercicio } from '../../domain/entities';
import { generarId } from '../../../infrastructure/utils/id';

export class SesionEntrenamientoUseCases {
  private readonly repo: ISesionEntrenamientoRepository;

  constructor(repo: ISesionEntrenamientoRepository) {
    this.repo = repo;
  }

  async obtenerTodas(): Promise<SesionEntrenamiento[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<SesionEntrenamiento | null> {
    return this.repo.findById(id);
  }

  async obtenerPorEquipo(equipoId: string): Promise<SesionEntrenamiento[]> {
    return this.repo.findByEquipo(equipoId);
  }

  async obtenerPorRangoFecha(fechaInicio: string, fechaFin: string): Promise<SesionEntrenamiento[]> {
    return this.repo.findByFecha(fechaInicio, fechaFin);
  }

  async crear(datos: Omit<SesionEntrenamiento, 'id' | 'creadoEn'>): Promise<SesionEntrenamiento> {
    const sesion: SesionEntrenamiento = {
      ...datos,
      id: generarId(),
      creadoEn: new Date().toISOString(),
    };
    await this.repo.save(sesion);
    return sesion;
  }

  async actualizar(id: string, datos: Partial<Omit<SesionEntrenamiento, 'id' | 'creadoEn'>>): Promise<SesionEntrenamiento> {
    const existente = await this.repo.findById(id);
    if (!existente) throw new Error(`Sesión con id ${id} no encontrada`);
    const actualizada = { ...existente, ...datos };
    await this.repo.save(actualizada);
    return actualizada;
  }

  async agregarEjercicio(sesionId: string, ejercicio: EntrenamientoEjercicio): Promise<SesionEntrenamiento> {
    const sesion = await this.repo.findById(sesionId);
    if (!sesion) throw new Error(`Sesión con id ${sesionId} no encontrada`);
    const yaExiste = sesion.ejercicios.some(e => e.ejercicioId === ejercicio.ejercicioId);
    if (!yaExiste) {
      sesion.ejercicios.push(ejercicio);
      await this.repo.save(sesion);
    }
    return sesion;
  }

  async quitarEjercicio(sesionId: string, ejercicioId: string): Promise<SesionEntrenamiento> {
    const sesion = await this.repo.findById(sesionId);
    if (!sesion) throw new Error(`Sesión con id ${sesionId} no encontrada`);
    sesion.ejercicios = sesion.ejercicios.filter(e => e.ejercicioId !== ejercicioId);
    await this.repo.save(sesion);
    return sesion;
  }

  async eliminar(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
