import type { ICategoriaEjercicioRepository } from '../../core/domain/ports';
import type { CategoriaEjercicio } from '../../core/domain/entities';
import { cargarDesdeStorage, guardarEnStorage } from '../utils/storage';

const CLAVE = 'sta_categorias';

export class LocalStorageCategoriaEjercicioRepository implements ICategoriaEjercicioRepository {
  async findAll(): Promise<CategoriaEjercicio[]> {
    return cargarDesdeStorage<CategoriaEjercicio>(CLAVE);
  }

  async findById(id: string): Promise<CategoriaEjercicio | null> {
    const todos = cargarDesdeStorage<CategoriaEjercicio>(CLAVE);
    return todos.find(c => c.id === id) ?? null;
  }

  async save(categoria: CategoriaEjercicio): Promise<void> {
    const todos = cargarDesdeStorage<CategoriaEjercicio>(CLAVE);
    const idx = todos.findIndex(c => c.id === categoria.id);
    if (idx >= 0) todos[idx] = categoria;
    else todos.push(categoria);
    guardarEnStorage(CLAVE, todos);
  }

  async delete(id: string): Promise<void> {
    const todos = cargarDesdeStorage<CategoriaEjercicio>(CLAVE);
    guardarEnStorage(CLAVE, todos.filter(c => c.id !== id));
  }
}
