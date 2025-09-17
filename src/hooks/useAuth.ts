import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { getFirebaseServices } from '../firebase/client';
import { timestamps } from '../firebase/firestore';
import { UserProfileSchema, type UserProfile } from '../types/firestore';
import { useAuthContext } from '../providers/AuthProvider';

export const useAuth = () => {
  const { auth, firestore } = getFirebaseServices();
  const { user, loading } = useAuthContext();

  const signIn = useCallback(
    async (email: string, password: string) => {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    },
    [auth],
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });

      const profileDoc = doc(firestore, 'users', credential.user.uid);
      const now = timestamps();
      const profile: UserProfile = {
        email,
        displayName,
        organizationId: null,
        photoURL: credential.user.photoURL,
        role: 'clinician',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      UserProfileSchema.parse(profile);
      await setDoc(profileDoc, { ...profile, ...now });
      return credential.user;
    },
    [auth, firestore],
  );

  const resetPassword = useCallback(
    async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    },
    [auth],
  );

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, [auth]);

  const loadUserProfile = useCallback(
    async (uid: string) => {
      const profileDoc = doc(firestore, 'users', uid);
      const snapshot = await getDoc(profileDoc);
      if (!snapshot.exists()) {
        return null;
      }
      const data = snapshot.data();
      return UserProfileSchema.parse({
        ...data,
        createdAt: data.createdAt.toDate?.() ?? data.createdAt,
        updatedAt: data.updatedAt.toDate?.() ?? data.updatedAt,
      });
    },
    [firestore],
  );

  return {
    user,
    loading,
    signIn,
    register,
    resetPassword,
    signOut: signOutUser,
    loadUserProfile,
  };
};
