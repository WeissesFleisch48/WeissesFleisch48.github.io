<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsuariosStore } from '../stores/usuarios';
import { useAuthStore } from '../stores/auth';
import type { Usuario, RolUsuario } from '../../core/domain/entities';

const store = useUsuariosStore();
const auth = useAuthStore();

const showModal = ref(false);
const usuarioEditando = ref<Usuario | null>(null);

const form = ref({
  username: '',
  password: '',
  nombre: '',
  rol: 'usuario' as RolUsuario
});

onMounted(() => {
  store.cargar();
});

function abrirModal(usuario?: Usuario) {
  if (usuario) {
    usuarioEditando.value = usuario;
    form.value = {
      username: usuario.username,
      password: '', // No mostramos la contraseña actual por seguridad
      nombre: usuario.nombre,
      rol: usuario.rol
    };
  } else {
    usuarioEditando.value = null;
    form.value = {
      username: '',
      password: '',
      nombre: '',
      rol: 'usuario'
    };
  }
  showModal.value = true;
}

async function guardar() {
  if (usuarioEditando.value) {
    // Si no se pone password, no la actualizamos (el repo debería manejarlo o mandamos datos parciales)
    const datosUpdate: any = { ...form.value };
    if (!datosUpdate.password) delete datosUpdate.password;
    
    await store.actualizar(usuarioEditando.value.id, datosUpdate);
  } else {
    if (!form.value.password) {
      alert('La contraseña es requerida para nuevos usuarios');
      return;
    }
    await store.crear(form.value);
  }
  showModal.value = false;
}

async function eliminar(id: string) {
  if (id === auth.usuario?.id) {
    alert('No puedes eliminar tu propio usuario');
    return;
  }
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    await store.eliminar(id);
  }
}
</script>

<template>
  <div class="fade-in">
    <div class="page-header">
      <h1 class="page-title">Gestión de Usuarios</h1>
      <button class="btn btn-primary" @click="abrirModal()">
        + Nuevo Usuario
      </button>
    </div>

    <div class="card table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Fecha Registro</th>
            <th style="text-align: right;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in store.usuarios" :key="u.id">
            <td>
              <div style="font-weight: 600;">{{ u.nombre }}</div>
            </td>
            <td>{{ u.username }}</td>
            <td>
              <span class="badge" :class="u.rol === 'admin' ? 'badge-cyan' : ''">
                {{ u.rol.toUpperCase() }}
              </span>
            </td>
            <td>{{ u.creadoEn.substring(0, 10) }}</td>
            <td style="text-align: right;">
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn btn-secondary btn-sm" @click="abrirModal(u)">Editar</button>
                <button 
                  v-if="u.id !== auth.usuario?.id"
                  class="btn btn-danger btn-sm" 
                  @click="eliminar(u.id)"
                >Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h2>{{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        
        <form @submit.prevent="guardar" style="margin-top: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input v-model="form.nombre" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Nombre de Usuario</label>
            <input v-model="form.username" type="text" class="form-input" required />
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña {{ usuarioEditando ? '(dejar vacío para no cambiar)' : '' }}</label>
            <input v-model="form.password" type="password" class="form-input" :required="!usuarioEditando" />
          </div>

          <div class="form-group">
            <label class="form-label">Rol del Usuario</label>
            <select v-model="form.rol" class="form-select">
              <option value="usuario">Usuario (Estándar)</option>
              <option value="admin">Administrador (Acceso Total)</option>
            </select>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Usuario</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-sm { padding: 0.25rem 0.5rem; font-size: 0.8125rem; }
</style>
