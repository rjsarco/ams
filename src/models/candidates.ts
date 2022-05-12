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

export interface SortingConfiguration {
  property?: 'first_name' | 'last_name' | 'age' | 'created_at' | 'interview_score' | 'technical_score' | 'score_sum' | string;
  direction?: 'asc' | 'desc';
}

export function sortCandidates(candidates: Candidate[], sortConfig: SortingConfiguration) {
  const { property, direction = 'desc' } = sortConfig;
  if (property) {
    let sortedCandidates = candidates;

    switch (property) {
      case 'first_name':
      case 'last_name':
        sortedCandidates = candidates.sort((a, b) => {
          const aName = property === 'first_name' ? a.first_name : a.last_name;
          const bName = property === 'last_name' ? b.first_name : b.last_name;
          return direction === "asc" ?
            aName.localeCompare(bName) :
            bName.localeCompare(aName);
        });
        break;
      case 'age':
        sortedCandidates = candidates.sort((a, b) => {
          return direction === "asc" ? a.age - b.age : b.age - a.age;
        });
        break;
      case 'interview_score':
      case 'technical_score':
      case 'score_sum':
        sortedCandidates = candidates.sort((a, b) => {
          const aScore = getScore(a, property);
          const bScore = getScore(b, property);
          return direction === "asc" ? aScore - bScore : bScore - aScore;
        });
        break;
      case 'created_at':
      default:
        sortedCandidates = candidates.sort((a, b) => {
          const aca = +a.created_at;
          const bca = +b.created_at;
          return direction === "asc" ? aca - bca : bca - aca;
        });
        break;
    }

    return sortedCandidates;
  } else {
    return candidates;
  }
}

function getScore(candidate: Candidate, type: 'interview_score' | 'technical_score' | 'score_sum') : number {
  let score = 0;

  if (type === 'interview_score') {
    score += candidate.interview_score;
  } else if (type === 'technical_score') {
    score += candidate.technical_score;
  } else {
    score += (candidate.interview_score + candidate.technical_score);
  }

  return score;
}