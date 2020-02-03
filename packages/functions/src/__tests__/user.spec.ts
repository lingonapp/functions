import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as myFunctions from "../";
import generatePushID from "../../src/generatePushID";

const config = {
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
const firebaseTest = functions.default(
  config,
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);

const VALID_USER_ID = generatePushID();

describe("User documents", () => {
  beforeAll(() => {
    // admin.initializeApp();
  });
  afterAll(async () => {
    await admin
      .firestore()
      .collection("locations")
      .doc(VALID_USER_ID)
      .delete();
    firebaseTest.cleanup();
  });
  test("Should update username to locations", async () => {
    // expect.assertions(1);
    // Arrange
    const beforeSnap = firebaseTest.firestore.makeDocumentSnapshot(
      { name: "name_before" },
      `users/${VALID_USER_ID}`
    );
    const afterSnap = firebaseTest.firestore.makeDocumentSnapshot(
      { name: "name_after" },
      `users/${VALID_USER_ID}`
    );
    const change = firebaseTest.makeChange(beforeSnap, afterSnap);

    // Act
    const wrapped = firebaseTest.wrap(myFunctions.onUserWrite);

    await wrapped(change);
    const createdSnap = await admin
      .firestore()
      .collection("locations")
      .doc(VALID_USER_ID)
      .get();
    const data = createdSnap.data();
    expect(data?.name).toBe("name_after");
  });
});
