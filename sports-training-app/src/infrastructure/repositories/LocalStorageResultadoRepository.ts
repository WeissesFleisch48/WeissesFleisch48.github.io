import type { IResultadoEjercicioRepository } from '../../core/domain/ports';
import type { ResultadoEjercicio } from '../../core/domain/entities';
import { cargarDesdeStorage, guardarEnStorage } from '../utils/storage';

const CLAVE = 'sta_resultados';

export class LocalStorageResultadoRepository implements IResultadoEjercicioRepository {
  async findAll(): Promise<ResultadoEjercicio[]> {
    return cargarDesdeStorage<ResultadoEjercicio>(CLAVE);
  }

  async findById(id: string): Promise<ResultadoEjercicio | null> {
    const todos = cargarDesdeStorage<ResultadoEjercicio>(CLAVE);
    return todos.find(r => r.id === id) ?? null;
  }

  async findBySesion(sesionId: string): Promise<ResultadoEjercicio[]> {
    const todos = cargarDesdeStorage<ResultadoEjercicio>(CLAVE);
    return todos.filter(r => r.sesionId === sesionId);
  }

  async findByJugador(jugadorId: string): Promise<ResultadoEjercicio[]> {
    const todos = cargarDesdeStorage<ResultadoEjercicio>(CLAVE);
    return todos.filter(r => r.jugadorId === jugadorId);
  }

  async findByEjercicio(ejercicioId: string): Promise<ResultadoEjercicio[]> {
    const todos = cargarDesdeStorage<ResultadoEjercicio>(CLAVE);
    return todos.filter(r => r.ejercicioId === ejercicioId);
  }

  async save(resultado: ResultadoEjercicio): Promise<void> {
    const todos = cargarDesdeStorage<ResultadoEjercicio>(CLAVE);
    const idx = todos.findIndex(r => r.id === resultado.id);
    if (idx >= 0) todos[idx] = resultado;
    else todos.push(resultado);
    guardarEnStorage(CLAVE, todos);
  }

  async delete(id: string): Promise<void> {
    const todos = cargarDesdeStorage<ResultadoEjercicio>(CLAVE);
    guardarEnStorage(CLAVE, todos.filter(r => r.id !== id));
  }
}
