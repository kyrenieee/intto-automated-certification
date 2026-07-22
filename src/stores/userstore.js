// src/stores/userStore.js
import { defineStore } from 'pinia'
import { getLiveToken, submitEventResponse } from '../service/docustore.js'

// this store previously had no formData, validateScan, or submitSurvey
export const useMobileStore = defineStore('mobile', {
  state: () => ({
    formData: {
      fullName: '',
      email: '',
      eventId: null,
      answers: {},
    },
    tokenValid: false,
  }),

  actions: {
    // checks the scanned token against the token qrstore.js last published for this event (see setLiveToken in docustore.js). 
    // returns a boolean so the caller can gate the UI instead of assuming success.
    async validateScan(token) {
      const eventId = this.formData.eventId
      if (!eventId || !token) {
        this.tokenValid = false
        return false
      }

      try {
        const live = await getLiveToken(eventId)
        const notExpired = !!live?.expiresAt && Date.now() < live.expiresAt
        this.tokenValid = !!(live && live.currentToken === token && notExpired)
      } catch (error) {
        console.error('Token validation failed:', error)
        this.tokenValid = false
      }

      return this.tokenValid
    },

    async submitSurvey() {
      return submitEventResponse(this.formData.eventId, this.formData.answers)
    },

    resetFormData() {
      this.formData = { fullName: '', email: '', eventId: null, answers: {} }
      this.tokenValid = false
    },
  },
})

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