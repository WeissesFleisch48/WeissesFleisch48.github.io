<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const cargando = ref(false);
const error = ref('');

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Por favor, ingrese sus credenciales';
    return;
  }

  cargando.value = true;
  error.value = '';

  try {
    const exito = await auth.login(username.value, password.value);
    if (exito) {
      router.push('/');
    } else {
      error.value = 'Usuario o contraseña incorrectos';
    }
  } catch (err) {
    error.value = 'Error al intentar iniciar sesión';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card card card-gradient fade-in">
      <div class="login-brand">
        <div class="brand-bolt">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bolt-svg">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h1 class="brand-name">PERFORM<span class="text-indigo">Q</span></h1>
      </div>
      
      <p class="login-subtitle">Sistema de Rendimiento Deportivo</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-input"  
            required 
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input" 
            required 
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="cargando">
          {{ cargando ? 'Iniciando sesión...' : 'Entrar al Sistema' }}
        </button>
      </form>

      <div class="login-footer">
        Acceso restringido a personal autorizado
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-bg-base);
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  text-align: center;
}

.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.brand-bolt {
  width: 48px;
  height: 48px;
  background: var(--color-accent-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.bolt-svg {
  width: 28px;
  height: 28px;
}

.brand-name {
  font-size: 1.75rem;
  margin-bottom: 0;
}

.text-indigo {
  color: var(--color-accent-primary);
}

.login-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 2.5rem;
}

.login-form {
  text-align: left;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
  padding: 0.875rem;
  font-size: 1rem;
}

.error-message {
  background: rgba(244, 63, 94, 0.1);
  color: var(--color-danger);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(244, 63, 94, 0.2);
}

.login-footer {
  margin-top: 2.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
