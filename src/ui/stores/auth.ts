import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Usuario } from '../../core/domain/entities';
import { authUseCases } from '../../infrastructure/di';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null);
  const router = useRouter();

  const estaAutenticado = computed(() => usuario.value !== null);
  const esAdmin = computed(() => usuario.value?.rol === 'admin');

  // Inicializar desde sessionStorage para persistencia de sesión
  const sessionUser = sessionStorage.getItem('performq_user_session');
  if (sessionUser) {
    try {
      usuario.value = JSON.parse(sessionUser);
    } catch {
      usuario.value = null;
    }
  }

  async function login(username: string, password: string): Promise<boolean> {
    const user = await authUseCases.login(username, password);
    if (user) {
      usuario.value = user;
      sessionStorage.setItem('performq_user_session', JSON.stringify(user));
      return true;
    }
    return false;
  }

  function logout() {
    usuario.value = null;
    sessionStorage.removeItem('performq_user_session');
    router.push('/login');
  }

  return {
    usuario,
    estaAutenticado,
    esAdmin,
    login,
    logout
  };
});
