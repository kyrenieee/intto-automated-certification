import { createWebHistory, createRouter } from "vue-router";

import login from "./components/login.vue";
import dashboard from "./components/admin/dashboard.vue";
import eventsall from "./components/admin/eventspages/eventsall.vue";
import eventsparticipant from "./components/admin/eventspages/eventsparticipants.vue";
import settings from "./components/admin/settings.vue";
import eventcal from "./components/admin/eventcal.vue";
import eventcaldetails from "./components/admin/eventcaldetails.vue";
import eventsactive from "./components/admin/eventspages/eventsactive.vue";

const routes = [
  { path: "/", component: login },
  { path: "/dashboard", component: dashboard },
  { path: "/events", component: eventsall },
  { path: "/participants", component: eventsparticipant },
  { path: "/settings", component: settings },
  { path: "/eventcal", component: eventcal },
  { path: "/eventcaldetails", component: eventcaldetails },
  { path: '/event-active/:id', component: eventsactive },
  {path: '/claim/:id', name: 'MobileSurvey', component: () => import('./components/user/mobileview.vue')}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
