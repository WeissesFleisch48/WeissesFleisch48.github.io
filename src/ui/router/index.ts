import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
    },
    {
      path: '/ejercicios',
      name: 'ejercicios',
      component: () => import('../views/EjerciciosView.vue'),
    },
    {
      path: '/equipos',
      name: 'equipos',
      component: () => import('../views/EquiposView.vue'),
    },
    {
      path: '/jugadores',
      name: 'jugadores',
      component: () => import('../views/JugadoresView.vue'),
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/UsuariosView.vue'),
      meta: { adminOnly: true }
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: () => import('../views/CalendarioView.vue'),
    },
    {
      path: '/entrenamiento/:id',
      name: 'entrenamiento',
      component: () => import('../views/SesionView.vue'),
    },
    {
      path: '/rankings',
      name: 'rankings',
      component: () => import('../views/RankingsView.vue'),
    },
  ],
});

router.beforeEach((to, _, next) => {
  const auth = useAuthStore();
  const estaAutenticado = auth.estaAutenticado;

  if (to.name !== 'login' && !estaAutenticado) {
    next({ name: 'login' });
  } else if (to.name === 'login' && estaAutenticado) {
    next({ name: 'dashboard' });
  } else if (to.meta.adminOnly && !auth.esAdmin) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

router.onError((error, to) => {
  // If a chunk fails to load, it usually means a new deploy happened.
  // We catch the error and force a hard reload of the target page
  // to fetch the new HTML and the new JS bundles.
  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed') ||
    error.name === 'ChunkLoadError'
  ) {
    if (to?.fullPath) {
      window.location.hash = to.fullPath; window.location.reload();
    } else {
      window.location.reload();
    }
  }
});

export default router;
