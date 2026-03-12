import type { Usuario } from '../../domain/entities';
import type { IUsuarioRepository } from '../../domain/ports';

export class AuthUseCases {
  private usuarioRepository: IUsuarioRepository;
  constructor(usuarioRepository: IUsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async login(username: string, password: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findByUsername(username);
    if (!usuario) return null;

    // En un sistema real, usaríamos bcrypt. Para local, comparamos texto plano
    if (usuario.password === password) {
      // Devolvemos el usuario sin el password por seguridad
      const { password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword as Usuario;
    }

    return null;
  }
}
