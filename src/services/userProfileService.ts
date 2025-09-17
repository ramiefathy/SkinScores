import { getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { docRef } from '../firebase/firestore';
import { UserProfileSchema, type UserProfile } from '../types/firestore';
import { resolveDate } from '../utils/firestore';

export const fetchUserProfile = async (uid: string) => {
  const ref = docRef<UserProfile>('users', uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return UserProfileSchema.parse({
    ...data,
    createdAt: resolveDate((data as Record<string, unknown>).createdAt),
    updatedAt: resolveDate((data as Record<string, unknown>).updatedAt),
  });
};

export const upsertUserProfile = async (uid: string, profile: UserProfile) => {
  UserProfileSchema.parse(profile);
  const ref = docRef<UserProfile>('users', uid);
  await setDoc(
    ref,
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
