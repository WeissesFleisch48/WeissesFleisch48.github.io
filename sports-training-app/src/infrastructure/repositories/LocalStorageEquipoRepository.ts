import type { IEquipoRepository } from '../../core/domain/ports';
import type { Equipo } from '../../core/domain/entities';
import { cargarDesdeStorage, guardarEnStorage } from '../utils/storage';

const CLAVE = 'sta_equipos';

export class LocalStorageEquipoRepository implements IEquipoRepository {
  async findAll(): Promise<Equipo[]> {
    return cargarDesdeStorage<Equipo>(CLAVE);
  }

  async findById(id: string): Promise<Equipo | null> {
    const todos = cargarDesdeStorage<Equipo>(CLAVE);
    return todos.find(e => e.id === id) ?? null;
  }

  async save(equipo: Equipo): Promise<void> {
    const todos = cargarDesdeStorage<Equipo>(CLAVE);
    const idx = todos.findIndex(e => e.id === equipo.id);
    if (idx >= 0) todos[idx] = equipo;
    else todos.push(equipo);
    guardarEnStorage(CLAVE, todos);
  }

  async delete(id: string): Promise<void> {
    const todos = cargarDesdeStorage<Equipo>(CLAVE);
    guardarEnStorage(CLAVE, todos.filter(e => e.id !== id));
  }
}
