import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
 } from 'firebase/auth'
import { getFirestore, 
         doc, 
         getDoc, 
         setDoc, 
         updateDoc,
         collection,
         writeBatch,
         query,
         getDocs
        } from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyAc6j0TBuT17-6PvDBOn0E4QRuG5ZLxbEE",
    authDomain: "crnw-clothing-db-40e1a.firebaseapp.com",
    projectId: "crnw-clothing-db-40e1a",
    storageBucket: "crnw-clothing-db-40e1a.appspot.com",
    messagingSenderId: "576013125991",
    appId: "1:576013125991:web:4229403b5a97aa3498c7c2"
  };
  
  // Initialize Firebase
  initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account"
  });


  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

  export const db = getFirestore();

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
      const docRef = doc(collectionRef, object.title.toLowerCase());
      batch.set(docRef, object);
    });

    await batch.commit();
    console.log('done');
  };

  export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);
    
    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
      const { title, items } = docSnapshot.data();
      acc[title.toLowerCase()] = items;
      return acc;
    }, {});

    return categoryMap;
  }

  export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    if (!userAuth) return;
    const userDocRef = doc(db, 'users', userAuth.uid);

    console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);
    console.log(userSnapshot);
    console.log(userSnapshot.exists());

    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            });
        } catch (error) {
            console.log('error creating user', error);
        }
    } else {
        try {
            await updateDoc(userDocRef, {
                ...additionalInformation
            });
        } catch (error) {
            console.log('error updating user', error);
        }
    }

    return userDocRef;
};


  export const createAuthUserWithEmailAndPassword = async (email, password) => {
   
    if(!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password)
  };

  export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    
    if(!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password)
  };


  export const signOutUser = async () => await signOut(auth);

  export const onAuthStateChangedListener = (callback, errorCallback = null, completedCallback = null) => 
    onAuthStateChanged(auth, callback, errorCallback, completedCallback);