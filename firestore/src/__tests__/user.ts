import {
  firestore,
  apps,
  loadFirestoreRules,
  clearFirestoreData,
  assertFails,
  assertSucceeds
} from "@firebase/testing";
import { projectSetup, authedApp } from "../shared/testUtils";

const { projectId, coverageUrl, rules, generateUid } = projectSetup({});
const VALID_USER_ID = generateUid();
const OTHER_USER_ID = generateUid();

describe("user", () => {
  beforeAll(async () => {
    await loadFirestoreRules({ projectId, rules });
  });

  beforeEach(async () => {
    await clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(apps().map(app => app.delete()));
    console.log(`View rule coverage information at ${coverageUrl}\n`);
  });

  describe("create user", () => {
    it("should require users to log in before creating profile", async () => {
      const db = authedApp(projectId);
      const profile = db.collection("users").doc(VALID_USER_ID);
      await assertFails(
        profile.set({ name: "Alice", isInNeed: false, photoUrl: "" })
      );
    });
    it("should only let users create their own profile", async () => {
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });

      await assertSucceeds(
        db
          .collection("users")
          .doc(VALID_USER_ID)
          .set({
            name: "Alice",
            photoUrl: "http://",
            isInNeed: false
          })
      );
      await assertFails(
        db
          .collection("users")
          .doc(OTHER_USER_ID)
          .set({
            name: "bob",
            isInNeed: false,
            photoUrl: "http"
          })
      );
    });
    it("should enforce user model on create", async () => {
      // Arrange
      const authenticatedFire = authedApp(projectId, {
        uid: VALID_USER_ID
      });

      // Act
      const invalidDbSet = authenticatedFire
        .collection("users")
        .doc(VALID_USER_ID)
        .set({
          name: "Alice",
          photoUrl: "http://",
          isInNeed: false,
          thisIsInvalidProp: "asg"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      const validDbSet = authenticatedFire
        .collection("users")
        .doc(VALID_USER_ID)
        .set({
          name: "Alice",
          photoUrl: "http://",
          isInNeed: false
        });

      // Assert
      await assertFails(invalidDbSet);
      await assertSucceeds(validDbSet);
    });
  });

  describe("delete user", () => {
    it("should require user to log in", async () => {
      // Arrange
      const authenticatedFire = authedApp(projectId);

      // Act
      const deleteYourProfile = authenticatedFire
        .collection("users")
        .doc(VALID_USER_ID)
        .delete();

      // Assert
      await assertFails(deleteYourProfile);
    });
    it("should not allow delete your profile", async () => {
      // Arrange
      const authenticatedFire = authedApp(projectId, { uid: VALID_USER_ID });

      // Act
      const deleteYourProfile = authenticatedFire
        .collection("users")
        .doc(VALID_USER_ID)
        .delete();

      // Assert
      await assertFails(deleteYourProfile);
    });
    it("should not allow delete someone else profile", async () => {
      // Arrange
      const authenticatedFire = authedApp(projectId, { uid: VALID_USER_ID });

      // Act
      const deleteSomeElse = authenticatedFire
        .collection("users")
        .doc(OTHER_USER_ID)
        .delete();

      // Assert
      await assertFails(deleteSomeElse);
    });
  });
});
