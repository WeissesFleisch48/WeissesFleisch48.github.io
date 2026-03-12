import type { Usuario } from '../../domain/entities';
import type { IUsuarioRepository } from '../../domain/ports';
import { v4 as uuidv4 } from 'uuid';

export class UsuarioUseCases {
  private usuarioRepository: IUsuarioRepository;
  constructor(usuarioRepository: IUsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async listar(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map(({ password: _, ...u }) => u as Usuario);
  }

  async crear(datos: Omit<Usuario, 'id' | 'creadoEn'>): Promise<Usuario> {
    const nuevo: Usuario = {
      ...datos,
      id: uuidv4(),
      creadoEn: new Date().toISOString()
    };
    await this.usuarioRepository.save(nuevo);
    const { password: _, ...usuarioSinPassword } = nuevo;
    return usuarioSinPassword as Usuario;
  }

  async actualizar(id: string, datos: Partial<Omit<Usuario, 'id' | 'creadoEn'>>): Promise<Usuario> {
    const existente = await this.usuarioRepository.findById(id);
    if (!existente) throw new Error('Usuario no encontrado');

    const actualizado: Usuario = {
      ...existente,
      ...datos
    };
    await this.usuarioRepository.save(actualizado);
    const { password: _, ...usuarioSinPassword } = actualizado;
    return usuarioSinPassword as Usuario;
  }

  async eliminar(id: string): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
