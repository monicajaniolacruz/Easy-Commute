import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/auth/LoginView.vue';
import HomeView from '@/views/system/HomeView.vue';
import FareView from '@/views/system/FareView.vue';
import ContactView from '@/views/system/ContactView.vue';
import RoutesView from '@/views/system/RoutesView.vue';
import MulticabView from '@/views/system/MulticabView.vue';
import TricycleView from '@/views/system/TricycleView.vue';
import ProfileView from '@/views/system/ProfileView.vue';
import { supabase } from '@/supabaseClient'; // Import your Supabase client

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/fare',
      name: 'fare',
      component: FareView,
      meta: { requiresAuth: true, isDefault: true },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { requiresAuth: true, isDefault: true },
    },
    {
      path: '/routes',
      name: 'routes',
      component: RoutesView,
      meta: { requiresAuth: true, isDefault: true },
    },
    {
      path: '/multicab',
      name: 'multicab',
      component: MulticabView,
      meta: { requiresAuth: true, isDefault: true },
    },
    {
      path: '/tricycle',
      name: 'tricycle',
      component: TricycleView,
      meta: { requiresAuth: true, isDefault: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, isDefault: true },
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser(); // Check current user from Supabase

  // If the route requires authentication and the user is not logged in
  if (to.meta.requiresAuth && !user) {
    next({ name: 'auth' }); // Redirect to the login page
  } else if (to.name === 'auth' && user) {
    next({ name: 'home' }); // Redirect logged-in users away from the login page
  } else {
    next(); // Proceed as normal
  }
});

export default router;
