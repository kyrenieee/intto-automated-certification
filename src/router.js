import { createMemoryHistory, createRouter } from 'vue-router'

import dashboard from './components/admin/dashboard.vue'
import activeevent from './components/admin/activeevent.vue'
import settings from './components/admin/settings.vue'
import eventcal from './components/admin/eventcal.vue'
import login from './components/login.vue'
import eventcaldetails from './components/admin/eventcal-details.vue'

const routes = [
  { path: '/login', component: login },
  { path: '/dashboard', component: dashboard },
  { path: '/active', component: activeevent },
  { path: '/settings', component: settings },
  { path: '/eventcal', component: eventcal },
  { path: '/eventcal-details', component: eventcaldetails },
  
]

const router = createRouter({
  // Note: We're using createMemoryHistory() here for compatibility
  //       with the Playground. In a real application you'd usually
  //       use createWebHistory() or createWebHashHistory() instead,
  //       tying the route to the browser URL. See the documentation
  //       for more information about history modes.
  history: createMemoryHistory(),
  routes,
})

export default router