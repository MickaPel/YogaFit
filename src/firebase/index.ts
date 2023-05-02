// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);

export { app, db, storage, auth }

// type FormFields = {
//     name: string,
// }

export const uploadProduct = async (
    // formFields: FormFields,
    file: Blob | ArrayBuffer,
    userName?: string
) => {
    try {
        // const { name } = formFields;

        // Upload image.
        const imageRef = ref(storage, `images/${userName}`);
        // const uploadImage = 
        await uploadBytes(imageRef, file);

        // Create file metadata.
        // const newMetadata = {
        //     cacheControl: 'public,max-age=2629800000', // 1 month
        //     contentType: uploadImage.metadata.contentType
        // };

        // await updateMetadata(imageRef, newMetadata);

        // Get the image URL.
        const publicImageUrl = await getDownloadURL(imageRef)

        // const userData = {
        //     // productName: name,
        //     // qty: 1,
        //     image: publicImageUrl,
        //     // created_at: serverTimestamp()
        // }

        // // Add the product to the cups collection.
        // // Remember that we're selling imaginary cups.
        // const cupRef = await addDoc(collection(db, "users"), userData);

        // // Add the cup id to the document reference.
        // await setDoc(cupRef, {
        //     id: cupRef.id
        // });

        // return cupRef.id;
        return publicImageUrl;
    } catch (error) {
        console.log(error);
    }
}

// export const getProducts = async ():Promise<DocumentData[]> => {
//     const cupRef = await getDocs(collection(db, "users"));
//     const productsMap = cupRef.docs.map(doc => doc.data());
    
//     return productsMap;
// }