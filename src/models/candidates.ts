import { useState, useCallback, useEffect } from 'react';

import { Candidate } from '../types';

import db from "../utils/firebase";

import {
  getDocs,
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  Unsubscribe,
  query,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
} from "firebase/firestore";

const candidatesCollection = collection(db, 'candidates');

export const candidateConverter = {
  toFirestore: (data: Candidate) => data,
  fromFirestore: (doc: QueryDocumentSnapshot<DocumentData>) : Candidate => {
    const data = doc.data();
    return {
      ...doc.data(),
      created_at: data.created_at.toDate(),
    } as Candidate;
  }
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const colWithConverter = candidatesCollection.withConverter(candidateConverter);
  const q = query(colWithConverter);

  const syncCandidates = useCallback((snapshot: QuerySnapshot<Candidate>) => {
    if (snapshot.docs.length) {
      const candidates: Candidate[] = snapshot.docs.map((d) => d.data() as Candidate);
      setCandidates(candidates);
    }
  }, [candidates]);

  useEffect(() => {
    const unsubscribe = onSnapshot(q, syncCandidates);
    return unsubscribe; // unsubscribe when component unmounts OR ELSE MEMEMORY LEAK
  }, []);

  return candidates;
}

export async function addCandidate(candidate: Candidate) {
  candidate.created_at = new Date();
  await addDoc(candidatesCollection, candidate);
}