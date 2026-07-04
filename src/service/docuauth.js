import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from './firebase-config' 

import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from 'firebase/auth'


export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const errorMsg = ref(null)

  //user login func
  const loginUser = async (email, password) => {
    errorMsg.value = null // Reset errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
       
    } catch (error) {
      console.error("Login failed:", error.message)
      errorMsg.value = "Invalid email or password." 
    }
  }

  const initializeAuthListener = () => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
    })
  }

  return { 
    user, 
    errorMsg, 
    loginUser, 
    initializeAuthListener 
  }
})