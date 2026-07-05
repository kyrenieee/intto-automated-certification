import { db } from './firebase-config' 
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore'

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