import { createWebHistory, createRouter } from "vue-router";
import { getAuth } from "firebase/auth"; 

import login from "./components/login.vue";
import dashboard from "./components/admin/dashboard.vue";
import eventsall from "./components/admin/eventspages/eventsall.vue";
import settings from "./components/admin/settings.vue";
import eventcal from "./components/admin/eventcal.vue";
import eventcaldetails from "./components/admin/eventcaldetails.vue";
import eventsactive from "./components/admin/eventspages/eventsactive.vue";

const routes = [
  { path: "/", component: login },
  { path: '/claim/:id', name: 'MobileSurvey', component: () => import('./components/user/mobileview.vue')},
  { path: '/present-qr/:id', name: 'PresentQR', component: () => import('./components/user/qrpop.vue') },
  { path: '/verification/:id', name: 'CertificateVerification', component: () => import('./components/user/verification.vue')},
  
  { path: "/dashboard", component: dashboard, meta: { requiresAuth: true } },
  { path: "/events", component: eventsall, meta: { requiresAuth: true } },
  { path: "/settings", component: settings, meta: { requiresAuth: true } },
  { path: "/eventcal", component: eventcal, meta: { requiresAuth: true } },
  { path: "/eventcaldetails", component: eventcaldetails, meta: { requiresAuth: true } },
  { path: '/event-active/:id', component: eventsactive, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Router Guard to block unauthenticated access to admin views
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/');
  } else {
    next(); 
  }
});

export default router;