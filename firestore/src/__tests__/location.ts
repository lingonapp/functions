import { adminApp } from "./../shared/testUtils";
import {
  apps,
  loadFirestoreRules,
  clearFirestoreData,
  assertFails,
  assertSucceeds
} from "@firebase/testing";
import firebase from "firebase/app";
import { projectSetup, authedApp } from "../shared/testUtils";

/*
 * ============
 *    Setup
 * ============
 */
const { projectId, coverageUrl, rules, generateUid } = projectSetup({});
const VALID_USER_ID = generateUid();
const OTHER_USER_ID = generateUid();
const VALID_LOCATION_REQUEST = {
  inNeedOf: 0,
  isInNeed: true,
  name: `name-${VALID_USER_ID}`,
  position: {
    geohash: "123",
    geopoint: new firebase.firestore.GeoPoint(20, 10)
  }
};

describe("location", () => {
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

  describe("create location", () => {
    it("should require user to log in", async () => {
      // Arrange
      const db = authedApp(projectId);
      const location = db.collection("locations").doc(VALID_USER_ID);
      // Act
      const createdLocation = location.set(VALID_LOCATION_REQUEST);

      // Assert
      await assertFails(createdLocation);
    });
    it("can only create your own location", async () => {
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      const yourLocation = db.collection("locations").doc(VALID_USER_ID);
      const othersLocation = db.collection("locations").doc(OTHER_USER_ID);
      // Act
      const createdYourLocation = yourLocation.set(VALID_LOCATION_REQUEST);
      const createdOthersLocation = othersLocation.set(VALID_LOCATION_REQUEST);

      // Assert
      await assertFails(createdOthersLocation);
      await assertSucceeds(createdYourLocation);
    });
    it("should require valid data", async () => {
      // Arrange
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      const location = db.collection("locations").doc(VALID_USER_ID);

      // Act
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createdInvalidLocation = location.set({ invalid: true } as any);
      const createdValidLocation = location.set(VALID_LOCATION_REQUEST);

      // Assert
      await assertFails(createdInvalidLocation);
      await assertSucceeds(createdValidLocation);
    });
  });

  describe("read location", () => {
    it("should require user to log in", async () => {
      const db = authedApp(projectId);
      const location = db.collection("locations").doc(VALID_USER_ID);
      await assertFails(location.get());
    });
    it("should be able to read all locations", async () => {
      // Arrange
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      const yourLocation = db.collection("locations").doc(VALID_USER_ID);
      const otherLocation = db.collection("locations").doc(OTHER_USER_ID);

      // Act
      const gotYourProfile = yourLocation.get();
      const gotOtherProfile = otherLocation.get();

      // Assert
      await assertSucceeds(gotYourProfile);
      await assertSucceeds(gotOtherProfile);
    });
  });

  describe("update location", () => {
    it("should require user to log in", async () => {
      const db = authedApp(projectId);
      const location = db.collection("locations").doc(VALID_USER_ID);
      await assertFails(location.update(VALID_LOCATION_REQUEST));
    });
    it("can only update your own location", async () => {
      // Arrange
      const adminDb = adminApp(projectId);
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      await adminDb
        .collection("locations")
        .doc(VALID_USER_ID)
        .set(VALID_LOCATION_REQUEST);
      await adminDb
        .collection("locations")
        .doc(OTHER_USER_ID)
        .set(VALID_LOCATION_REQUEST);
      const yourLocation = db.collection("locations").doc(VALID_USER_ID);
      const othersLocation = db.collection("locations").doc(OTHER_USER_ID);

      // Act
      const updatedYourLocation = yourLocation.update({
        ...VALID_LOCATION_REQUEST,
        isInNeed: false
      });
      const updatedOthersLocation = othersLocation.update({
        ...VALID_LOCATION_REQUEST,
        isInNeed: false
      });

      // Assert
      await assertFails(updatedOthersLocation);
      await assertSucceeds(updatedYourLocation);
    });
    it("can only update with valid data", async () => {
      // Arrange
      const adminDb = adminApp(projectId);
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      await adminDb
        .collection("locations")
        .doc(VALID_USER_ID)
        .set(VALID_LOCATION_REQUEST);
      const yourLocation = db.collection("locations").doc(VALID_USER_ID);

      // Act
      const updateWithValidData = yourLocation.update({
        ...VALID_LOCATION_REQUEST,
        inNeedOf: 1
      });
      const updateWithInValidData = yourLocation.update({ invalid: true });

      // Assert
      await assertSucceeds(updateWithValidData);
      await assertFails(updateWithInValidData);
    });
  });
  describe("delete location", () => {
    it("can't delete your own", async () => {
      const adminDb = adminApp(projectId);
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      await adminDb
        .collection("locations")
        .doc(VALID_USER_ID)
        .set(VALID_LOCATION_REQUEST);
      const yourLocation = db.collection("locations").doc(VALID_USER_ID);

      // Act
      const deleteYourLocation = yourLocation.delete();

      // Assert
      await assertFails(deleteYourLocation);
    });
    it("can't delete others", async () => {
      const adminDb = adminApp(projectId);
      const db = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      await adminDb
        .collection("locations")
        .doc(OTHER_USER_ID)
        .set(VALID_LOCATION_REQUEST);
      const othersLocation = db.collection("locations").doc(OTHER_USER_ID);

      // Act
      const deleteOthersLocation = othersLocation.delete();

      // Assert
      await assertFails(deleteOthersLocation);
    });
  });
});
