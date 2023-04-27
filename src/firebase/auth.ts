import { app, auth } from "./index";
import {
    createUserWithEmailAndPassword, 
    updateProfile,
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    NextOrObserver,
    User,
    deleteUser
    } from 'firebase/auth';

export const signUpUser = async (
    displayName: string,
    email: string, 
    password: string
    ) => {
        if (!email && !password) return;
    
    const userCredential = await createUserWithEmailAndPassword(
        auth, email, password
    );

    if (userCredential && auth.currentUser) {

        try {
            updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: "https://robohash.org/2?set=set2"
            })
        } catch (error) {
            console.log(error)
        }
    }

    return userCredential
}

export const signInUser = async (
    email: string, 
    password: string
    ) => {
        if (!email && !password) return;
    
    return await signInWithEmailAndPassword(auth, email, password)
}
    
export const userStateListener = (callback:NextOrObserver<User>) => {
    return onAuthStateChanged(auth, callback)
}
    
export const SignOutUser = async () => await signOut(auth);

export const DeleteUser = (auth: User) => {
    deleteUser(auth)
        .then(() => {
            // navigate('/')
            console.log('')
        }).catch((error) => {
            console.log(error)
        });
}