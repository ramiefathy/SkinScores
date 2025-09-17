import {
  addDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { collectionRef, docRef } from '../firebase/firestore';
import { PatientProfileSchema, type PatientProfile } from '../types/firestore';
import { resolveDate } from '../utils/firestore';

type PatientRecord = PatientProfile & { id: string };

const parsePatient = (id: string, data: PatientProfile): PatientRecord => {
  const parsed = PatientProfileSchema.parse({
    ...data,
    createdAt: resolveDate((data as Record<string, unknown>).createdAt),
    updatedAt: resolveDate((data as Record<string, unknown>).updatedAt),
  });
  return {
    ...parsed,
    id,
  };
};

export const listPatientsForUser = async (userId: string): Promise<PatientRecord[]> => {
  const q = query(collectionRef<PatientProfile>('patients'), where('ownerUserId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnapshot) => parsePatient(docSnapshot.id, docSnapshot.data()));
};

export const getPatient = async (patientId: string): Promise<PatientRecord | null> => {
  const snapshot = await getDoc(docRef<PatientProfile>('patients', patientId));
  if (!snapshot.exists()) return null;
  return parsePatient(snapshot.id, snapshot.data());
};

type CreatePatientInput = {
  displayId: string;
  notes?: string;
  ownerUserId: string;
  organizationId?: string | null;
};

export const createPatient = async ({
  displayId,
  notes,
  ownerUserId,
  organizationId,
}: CreatePatientInput): Promise<string> => {
  const payload: PatientProfile = {
    displayId,
    notes,
    ownerUserId,
    organizationId: organizationId ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  PatientProfileSchema.parse(payload);
  const ref = await addDoc(collectionRef<PatientProfile>('patients'), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

type UpdatePatientInput = {
  patientId: string;
  notes?: string;
  displayId?: string;
};

export const updatePatient = async ({ patientId, notes, displayId }: UpdatePatientInput) => {
  const updates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (notes !== undefined) updates.notes = notes;
  if (displayId !== undefined) updates.displayId = displayId;
  await updateDoc(docRef<PatientProfile>('patients', patientId), updates);
};

export type { PatientRecord };
