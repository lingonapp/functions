import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DB_URL
});
const db = admin.firestore();

export const onUserWrite = functions.firestore
  .document("users/hej")
  .onWrite(async (change, context) => {
    const afterData = change.after.data();
    const userId = change.before.id;
    await db
      .doc(`locations/${userId}`)
      .set({ name: afterData?.name ?? "" }, { merge: true });
  });
