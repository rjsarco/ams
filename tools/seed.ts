require('dotenv').config();
import * as admin from "firebase-admin";

import candidates from "./candidates";

process.env.FIRESTORE_EMULATOR_HOST = process.env.REACT_APP_FIRESTORE_EMULATOR_HOST;
const app = admin.initializeApp({
  projectId: "test",
});
const db = admin.firestore(app);

async function main() {
  for(const c in candidates) {
    const candidate = candidates[c];
    const ref = db.doc(c);
    await ref.set(candidate, { merge: true });
  }
  console.log("seeding done!");
}

main();