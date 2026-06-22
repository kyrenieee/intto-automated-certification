import {ref} from 'vue'
import { defineStore } from 'pinia'
import {db} from './firebase-config'
import { collection, getDocs, addDoc, setDoc } from 'firebase/firestore'

// connects the backend database to the frontend and allows for data to be stored and retrieved from the database
// operation that can be performed on the database include: add, delete, update, and retrieve data from the database
// CRUD (For firestore only)
export const useDocuStore = defineStore('document', async () => { 
    //insert the value of the input field before into the database
    // document - paramaeter that is passed to the function and is used to store the value of the input field into the database
    // ref - insert into an array of documents that is stored in the database
    const docuList = ref([])
    const docuCollectionRef = collection(db, 'documents') 
    // collection - bucket in the database that is used to store the documents

        // try {
        // const docRef = await addDoc(collection(db, "users"), {
        // // collection accpets two parameters, the first is the database and the second is the name of the collection that is being created
        //     first: "Miguel",
        //     last: "Gumiran",
        //     born: 2004
        // });
        // console.log("Document written with ID: ", docRef.id);
        // } catch (e) {
        // console.error("Error adding document: ", e);
        // }

    // const readDocument = async () => {
    //     try {
    //         const querySnapshot = await getDocs(collection(db, "users"));
    //         querySnapshot.forEach((doc) => {
    //             console.log(`${doc.id} => ${doc.data()}`);  
    //         })
    //     } catch (e) {
    //     console.error("Error adding document: ", e);
    //     }
    // };

    // const addDocument = async () => {
    //     try {
    //     const docRef = await addDoc(collection(db, "users"), {
    //     // collection accpets two parameters, the first is the database and the second is the name of the collection that is being created
    //         first: "Lark",
    //         last: "Orillos",
    //         born: 2001
    //     });
    //     console.log("Document written with ID: ", docRef.id);
    //     } catch (e) {
    //     console.error("Error adding document: ", e);
    //     }
    // }
    
    return {addDoc};
}); 


//initiated and implemented firestore (CRUD)



