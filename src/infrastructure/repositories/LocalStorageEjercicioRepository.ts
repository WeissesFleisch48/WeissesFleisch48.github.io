import type { IEjercicioRepository } from '../../core/domain/ports';
import type { Ejercicio } from '../../core/domain/entities';
import { cargarDesdeStorage, guardarEnStorage } from '../utils/storage';

const CLAVE = 'sta_ejercicios';

export class LocalStorageEjercicioRepository implements IEjercicioRepository {
  async findAll(): Promise<Ejercicio[]> {
    return cargarDesdeStorage<Ejercicio>(CLAVE);
  }

  async findById(id: string): Promise<Ejercicio | null> {
    const todos = cargarDesdeStorage<Ejercicio>(CLAVE);
    return todos.find(e => e.id === id) ?? null;
  }

  async findByCategoria(categoriaId: string): Promise<Ejercicio[]> {
    const todos = cargarDesdeStorage<Ejercicio>(CLAVE);
    return todos.filter(e => e.categoriaId === categoriaId);
  }

  async save(ejercicio: Ejercicio): Promise<void> {
    const todos = cargarDesdeStorage<Ejercicio>(CLAVE);
    const idx = todos.findIndex(e => e.id === ejercicio.id);
    if (idx >= 0) todos[idx] = ejercicio;
    else todos.push(ejercicio);
    guardarEnStorage(CLAVE, todos);
  }

  async delete(id: string): Promise<void> {
    const todos = cargarDesdeStorage<Ejercicio>(CLAVE);
    guardarEnStorage(CLAVE, todos.filter(e => e.id !== id));
  }
}
