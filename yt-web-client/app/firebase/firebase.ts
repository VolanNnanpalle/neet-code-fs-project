// Import the functions you need from the SDKs you need
import exp from "constants";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, //
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, //help us detect if the user is signed in or out 
    User
} from "firebase/auth";
import { runInContext } from "vm";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqsbb1fx_iZSuq51lDpDcmEo4Ld5gBFvg",
    authDomain: "yt-clone-55d75.firebaseapp.com",
    projectId: "yt-clone-55d75",
    appId: "1:282221197648:web:3062dd5019535f86851455"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

/**
 * Signs the user in with a Google popup. 
 * @returns A promise that resolves with the user's credentials
 */
export function signInWithGoogle(){
    return signInWithPopup(auth,new GoogleAuthProvider());
}

/**
 * Sign the user out. 
 * @returns A promise that resolves when the user is signed out. 
 * 
 */
export function signOut(){
    return auth.signOut();
}

/**
 * Trigger a callback when a user auth state changes
 * @returns A function to unsubscribe callback. 
 */
export function onAuthStateChangedHelper(callback:(user:User | null)=> void){
    return onAuthStateChanged(auth, callback);

}