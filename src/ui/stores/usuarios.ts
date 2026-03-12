import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Usuario } from '../../core/domain/entities';
import { usuarioUseCases } from '../../infrastructure/di';

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref<Usuario[]>([]);
  const cargando = ref(false);

  async function cargar() {
    cargando.value = true;
    try {
      usuarios.value = await usuarioUseCases.listar();
    } finally {
      cargando.value = false;
    }
  }

  async function crear(datos: Omit<Usuario, 'id' | 'creadoEn'>) {
    const nuevo = await usuarioUseCases.crear(datos);
    usuarios.value.push(nuevo);
    return nuevo;
  }

  async function actualizar(id: string, datos: Partial<Omit<Usuario, 'id' | 'creadoEn'>>) {
    const actualizado = await usuarioUseCases.actualizar(id, datos);
    const index = usuarios.value.findIndex(u => u.id === id);
    if (index >= 0) {
      usuarios.value[index] = actualizado;
    }
  }

  async function eliminar(id: string) {
    await usuarioUseCases.eliminar(id);
    usuarios.value = usuarios.value.filter(u => u.id !== id);
  }

  return {
    usuarios,
    cargando,
    cargar,
    crear,
    actualizar,
    eliminar
  };
});
