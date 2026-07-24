import { db } from "./firebase-config";
import {collection, addDoc, getDocs, orderBy, query, doc, getDoc, setDoc, where } from "firebase/firestore";

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

// save a participant's survey answers for an event
// NOTE: this was previously missing entirely - CertificateClaim.vue and
// mobileview.vue both assumed a function like this existed and called
// into it (directly or via the store), but nothing wrote to "responses".
export const submitEventResponse = async (eventId, answers) => {
  try {
    const docRef = await addDoc(collection(db, "responses"), {
      eventId,
      answers,
      submittedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting event response: ", error);
    throw error;
  }
};

// rolling QR token
// qrstore.js generates a new token every minute, but it only ever lived in the  admin device's local Pinia state. A participant's phone has no way to  confirm the token it scanned is the "real" current one unless that token is published somewhere both devices can read. These two functions store  the event's current valid token (and its expiry) in its own collection.

export const setLiveToken = async (eventId, token, expiresAt) => {
  try {
    await setDoc(doc(db, "liveTokens", eventId), {
      currentToken: token,
      expiresAt, // epoch ms
    });
  } catch (error) {
    console.error("Error publishing live token: ", error);
    // Deliberately not re-thrown: a failed publish shouldn't crash the
    // admin's QR screen, it just means that tick's token can't be verified.
  }
};

export const getLiveToken = async (eventId) => {
  try {
    const docRef = doc(db, "liveTokens", eventId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching live token: ", error);
    return null;
  }
};