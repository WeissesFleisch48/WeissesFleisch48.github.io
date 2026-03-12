import type { ISesionEntrenamientoRepository } from '../../core/domain/ports';
import type { SesionEntrenamiento } from '../../core/domain/entities';
import { cargarDesdeStorage, guardarEnStorage } from '../utils/storage';

const CLAVE = 'sta_sesiones';

export class LocalStorageSesionRepository implements ISesionEntrenamientoRepository {
  async findAll(): Promise<SesionEntrenamiento[]> {
    return cargarDesdeStorage<SesionEntrenamiento>(CLAVE);
  }

  async findById(id: string): Promise<SesionEntrenamiento | null> {
    const todos = cargarDesdeStorage<SesionEntrenamiento>(CLAVE);
    return todos.find(s => s.id === id) ?? null;
  }

  async findByEquipo(equipoId: string): Promise<SesionEntrenamiento[]> {
    const todos = cargarDesdeStorage<SesionEntrenamiento>(CLAVE);
    return todos.filter(s => s.equipoId === equipoId);
  }

  async findByFecha(fechaInicio: string, fechaFin: string): Promise<SesionEntrenamiento[]> {
    const todos = cargarDesdeStorage<SesionEntrenamiento>(CLAVE);
    return todos.filter(s => s.fecha >= fechaInicio && s.fecha <= fechaFin);
  }

  async save(sesion: SesionEntrenamiento): Promise<void> {
    const todos = cargarDesdeStorage<SesionEntrenamiento>(CLAVE);
    const idx = todos.findIndex(s => s.id === sesion.id);
    if (idx >= 0) todos[idx] = sesion;
    else todos.push(sesion);
    guardarEnStorage(CLAVE, todos);
  }

  async delete(id: string): Promise<void> {
    const todos = cargarDesdeStorage<SesionEntrenamiento>(CLAVE);
    guardarEnStorage(CLAVE, todos.filter(s => s.id !== id));
  }
}
