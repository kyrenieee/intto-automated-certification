
import { db } from './firebase-config' 
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { defineStore } from 'firebase/firestore'


export const useDocuStore = defineStore('document', async () => { 
    //insert the value of the input field before into the database
    // document - paramaeter that is passed to the function and is used to store the value of the input field into the database
    // ref - insert into an array of documents that is stored in the database
    const docuList = ref([])
    const docuCollectionRef = collection(db, 'documents')
      return {addDoc};
}); 

// new event func
export const createEventInFirestore = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: new Date().toISOString()
    }) 
    return docRef.id
  } catch (error) {
    console.error("Error adding event: ", error)
    throw error
  }
}


// feych events
export const fetchAllEvents = async () => {
  try {
    // creation date
    const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(eventsQuery)
    
    const eventsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return eventsList
  } catch (error) {
    console.error("Error fetching events: ", error)
    throw error
  }
}