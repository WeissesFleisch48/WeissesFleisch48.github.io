import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
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

export default router;
