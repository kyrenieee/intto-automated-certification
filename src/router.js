import { createMemoryHistory, createRouter } from 'vue-router'

import login from './components/login.vue'
import dashboard from './components/admin/dashboard.vue'
import eventsall from './components/admin/eventspages/eventsall.vue' 
import eventsparticipant from './components/admin/eventspages/eventsparticipants.vue' 
import settings from './components/admin/settings.vue'
import eventcal from './components/admin/eventcal.vue'
import login from './components/login.vue'
import eventcaldetails from './components/admin/eventcal-details.vue'

const routes = [
  { path: '/login', component: login },
  { path: '/dashboard', component: dashboard },
  { path: '/active', component: eventsall }, 
  { path: '/participants', component: eventsparticipant },
  { path: '/settings', component: settings },
  { path: '/eventcal', component: eventcal },
  
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

