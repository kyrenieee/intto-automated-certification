import { createWebHistory, createRouter } from 'vue-router'

import login from './components/login.vue' 
import dashboard from './components/admin/dashboard.vue'
import eventsall from './components/admin/eventspages/eventsall.vue' 
import eventsparticipant from './components/admin/eventspages/eventsparticipants.vue' 
import settings from './components/admin/settings.vue'
import eventcal from './components/admin/eventcal.vue'

const routes = [
  { path: '/', component: login },
  { path: '/dashboard', component: dashboard },
  { path: '/active', component: eventsall }, 
  { path: '/participants', component: eventsparticipant },
  { path: '/settings', component: settings },
  { path: '/eventcal', component: eventcal },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router