import {
  collection,
  doc,
  serverTimestamp,
  type DocumentReference,
  type Firestore,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore';
import { getFirebaseServices } from './client';
import {
  collectionNames,
  type CollectionName,
  type ScoreResult,
  type ScoreSession,
  type UserProfile,
  type PatientProfile,
} from '../types/firestore';

export const getFirestoreDb = (): Firestore => getFirebaseServices().firestore;

const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (value: T) => value as Record<string, unknown>,
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) =>
    snapshot.data(options) as T,
});

export const collectionRef = <T>(name: CollectionName) =>
  collection(getFirestoreDb(), collectionNames[name]).withConverter<T>(converter<T>());

export const docRef = <T>(name: CollectionName, id: string): DocumentReference<T> =>
  doc(getFirestoreDb(), collectionNames[name], id).withConverter<T>(converter<T>());

export const timestamps = () => ({
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const collections = {
  users: () => collectionRef<UserProfile>('users'),
  scoreSessions: () => collectionRef<ScoreSession>('scoreSessions'),
  scoreResults: () => collectionRef<ScoreResult>('scoreResults'),
  patients: () => collectionRef<PatientProfile>('patients'),
};
