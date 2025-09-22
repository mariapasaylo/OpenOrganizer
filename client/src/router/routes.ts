import type { RouteRecordRaw } from 'vue-router';

/* Updated on 9/22/2025 by Rachel Patella - Routes were defined for 3 main pages: Registration, Login, and Calendar. 
Keeping the default CRUD testing IndexPage for now until further development on calendar **/
// References: https://router.vuejs.org/guide/ and https://quasar.dev/layout/routing-with-layouts-and-pages/

// Instead of IndexPage being the main '/' page it will become Calendar Page after more development
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', component: () => import('pages/IndexPage.vue')
      },
    ], 
  },
  {
      path: '/register', 
      component: () => import('pages/RegisterPage.vue')
  },
  {
      path: '/login', component: () => import('pages/LoginPage.vue')
  },
  {
      path: '/calendar', component: () => import('pages/CalendarPage.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
