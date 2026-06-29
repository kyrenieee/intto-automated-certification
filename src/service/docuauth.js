import {ref} from 'vue'
import { defineStore } from 'pinia'
import {db} from './firebase-config'
import { collection, getDocs, addDoc, setDoc } from 'firebase/firestore'
import { collection, getDocs, addDoc, setDoc } from 'firebase/auth'

export const useDocuAuth = defineStore('document', async () => { 
    const docuList = ref([])
    const docuCollectionRef = collection(db, 'documents') 
    
    return {addDoc};
}); 


//initiated and implemented firestore (CRUD)



