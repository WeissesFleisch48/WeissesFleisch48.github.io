import type { Usuario } from '../../core/domain/entities';
import type { IUsuarioRepository } from '../../core/domain/ports';
import { cargarDesdeStorage, guardarEnStorage } from '../utils/storage';

const CLAVE_STORAGE = 'performq_usuarios';

export class LocalStorageUsuarioRepository implements IUsuarioRepository {
  constructor() {
    this.inicializarAdmin();
  }

  private inicializarAdmin() {
    const usuarios = cargarDesdeStorage<Usuario>(CLAVE_STORAGE);
    const adminExiste = usuarios.some(u => u.username === 'admin');
    
    if (!adminExiste) {
      const adminDefault: Usuario = {
        id: 'user-admin-default',
        username: 'admin',
        password: '4899',
        rol: 'admin',
        nombre: 'Administrador Principal',
        creadoEn: new Date().toISOString()
      };
      usuarios.push(adminDefault);
      guardarEnStorage(CLAVE_STORAGE, usuarios);
    }
  }

  async findAll(): Promise<Usuario[]> {
    return cargarDesdeStorage<Usuario>(CLAVE_STORAGE);
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuarios = await this.findAll();
    return usuarios.find(u => u.id === id) || null;
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    const usuarios = await this.findAll();
    return usuarios.find(u => u.username === username) || null;
  }

  async save(usuario: Usuario): Promise<void> {
    const usuarios = await this.findAll();
    const index = usuarios.findIndex(u => u.id === usuario.id);
    
    if (index >= 0) {
      usuarios[index] = usuario;
    } else {
      usuarios.push(usuario);
    }
    
    guardarEnStorage(CLAVE_STORAGE, usuarios);
  }

  async delete(id: string): Promise<void> {
    const usuarios = await this.findAll();
    const filtrados = usuarios.filter(u => u.id !== id);
    guardarEnStorage(CLAVE_STORAGE, filtrados);
  }
}
