import type { IJugadorRepository } from '../../core/domain/ports';
import type { Jugador } from '../../core/domain/entities';
import { cargarDesdeStorage, guardarEnStorage } from '../utils/storage';

const CLAVE = 'sta_jugadores';

export class LocalStorageJugadorRepository implements IJugadorRepository {
  async findAll(): Promise<Jugador[]> {
    return cargarDesdeStorage<Jugador>(CLAVE);
  }

  async findById(id: string): Promise<Jugador | null> {
    const todos = cargarDesdeStorage<Jugador>(CLAVE);
    return todos.find(j => j.id === id) ?? null;
  }

  async findByEquipo(equipoId: string): Promise<Jugador[]> {
    const todos = cargarDesdeStorage<Jugador>(CLAVE);
    return todos.filter(j => j.equipoId === equipoId);
  }

  async save(jugador: Jugador): Promise<void> {
    const todos = cargarDesdeStorage<Jugador>(CLAVE);
    const idx = todos.findIndex(j => j.id === jugador.id);
    if (idx >= 0) todos[idx] = jugador;
    else todos.push(jugador);
    guardarEnStorage(CLAVE, todos);
  }

  async delete(id: string): Promise<void> {
    const todos = cargarDesdeStorage<Jugador>(CLAVE);
    guardarEnStorage(CLAVE, todos.filter(j => j.id !== id));
  }
}
