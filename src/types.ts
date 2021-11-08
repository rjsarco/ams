import {
  FieldValue,
} from "firebase/firestore";
export interface Candidate {
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date | FieldValue;
  age: number;
  interview_score: number;
  technical_score: number;
}