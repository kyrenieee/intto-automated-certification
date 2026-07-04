// src/stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    userEmail: null,
    userName: null,
    isAuthenticated: false
  }),
  
  actions: {
    setUser(userData) {
      this.userId = userData.documentId
      this.userEmail = userData.email
      this.userName = userData.name || 'User'
      this.isAuthenticated = true
    },
    
    clearUser() {
      this.userId = null
      this.userEmail = null
      this.userName = null
      this.isAuthenticated = false
    }
  },
  
  getters: {
    getUserId: (state) => state.userId,
    getUserEmail: (state) => state.userEmail,
    getUserName: (state) => state.userName
  }
})