import { db } from "./firebase-config";
import {collection, addDoc, getDocs, orderBy, query, doc, getDoc, where } from "firebase/firestore";

//create new event func
export const createEventInFirestore = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding event: ", error);
    throw error;
  }
};

//fetch events func
export const fetchAllEvents = async () => {
  try {
    // Order by creation date
    const eventsQuery = query(
      collection(db, "events"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(eventsQuery);

    const eventsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return eventsList;
  } catch (error) {
    console.error("Error fetching events: ", error);
    throw error;
  }
};

//fetch event by id
export const getEventById = async (eventId) => {
  try {
    // ref to ID
    const docRef = doc(db, "events", eventId);
    
    // fetch id
    const docSnap = await getDoc(docRef);

    // event exists?
    if (docSnap.exists()) {
      // return event data 
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No event found!");
    }
  } catch (error) {
    console.error("Error fetching event by ID: ", error);
    throw error;
  }
};

// fetch survey responses for a specific event
export const getEventResponses = async (eventId) => {
  try {
    const responsesRef = collection(db, "responses");
    
    const q = query(responsesRef, where("eventId", "==", eventId));
    const querySnapshot = await getDocs(q);
    
    const responses = [];
    querySnapshot.forEach((doc) => {
      responses.push({ id: doc.id, ...doc.data() });
    });
    
    return responses;
  } catch (error) {
    console.error("Error fetching event responses: ", error);
    return []; 
  }
};