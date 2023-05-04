// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    getDocs, 
    updateDoc, 
    DocumentData,
    setDoc
} from "firebase/firestore";
import { 
    getDownloadURL, 
    getStorage, 
    ref, 
    updateMetadata, 
    uploadBytes 
} from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: "yogafit-c885a",
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    // messagingSenderId: "611409530955",
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASURMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage, auth }

export const uploadProduct = async (
    file: Blob | ArrayBuffer,
    userName?: string
) => {
    try {
        // Upload image.
        const imageRef = ref(storage, `images/${userName}`);
        await uploadBytes(imageRef, file);

        // Get the image URL.
        const publicImageUrl = await getDownloadURL(imageRef)
        return publicImageUrl;
    } catch (error) {
        console.log(error);
    }
}