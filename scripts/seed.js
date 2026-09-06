import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDCntyPrWeh5IEkDZiSZbZTCeFYIQcLvT4',
  authDomain: 'chatapp-1beb3.firebaseapp.com',
  projectId: 'chatapp-1beb3',
  storageBucket: 'chatapp-1beb3.firebasestorage.app',
  messagingSenderId: '707593388737',
  appId: '1:707593388737:web:d8be2e959b74c27d104a40',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const demoUsers = [
  {
    displayName: 'Alice Smith',
    email: 'alice@example.com',
    password: 'password123',
    bio: 'Tech Lead & Full Stack Developer 🚀',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isOnline: true,
  },
  {
    displayName: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    bio: 'UI/UX Designer & Coffee lover ☕',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isOnline: true,
  },
  {
    displayName: 'Charlie Davis',
    email: 'charlie@example.com',
    password: 'password123',
    bio: 'Product Manager & Mobile enthusiast 📱',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isOnline: false,
  },
  {
    displayName: 'Diana Prince',
    email: 'diana@example.com',
    password: 'password123',
    bio: 'Cloud Architect & Open Source contributor ☁️',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isOnline: true,
  },
];

async function seed() {
  console.log('🌱 Starting Firebase Seeding...');

  for (const user of demoUsers) {
    try {
      let uid = '';
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );
        uid = cred.user.uid;
        console.log(`Created Auth Account: ${user.email} (${uid})`);
      } catch (authError) {
        if (authError.code === 'auth/email-already-in-use') {
          const cred = await signInWithEmailAndPassword(
            auth,
            user.email,
            user.password
          );
          uid = cred.user.uid;
          console.log(`User already exists, logged in: ${user.email} (${uid})`);
        } else {
          throw authError;
        }
      }

      const now = Date.now();
      const userProfile = {
        id: uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        bio: user.bio,
        isOnline: user.isOnline,
        lastSeen: now,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'users', uid), userProfile, { merge: true });
      console.log(`Saved Firestore Profile: ${user.displayName}`);
    } catch (err) {
      console.error(`Error processing ${user.email}:`, err.message);
    }
  }

  console.log('\n✅ Firebase Seeding Completed Successfully!');
  process.exit(0);
}

seed();
