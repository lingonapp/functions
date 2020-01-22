import {
  firestore,
  apps,
  loadFirestoreRules,
  clearFirestoreData,
  assertFails,
  assertSucceeds
} from "@firebase/testing";
import { projectSetup, authedApp } from "../shared/testUtils";
/*
 * ============
 *    Setup
 * ============
 */
const { projectId, coverageUrl, rules, generateUid } = projectSetup({});
const VALID_USER_ID = generateUid();
const OTHER_USER_ID = generateUid();
const VALID_CHAT = {
  userIds: [VALID_USER_ID, OTHER_USER_ID],
  latestMessage: {
    createdAt: "2019",
    text: "chattext",
    from: {
      name: "user1",
      photoUrl: "https://"
    }
  },
  usersMap: [
    [
      VALID_USER_ID,
      {
        name: "user1",
        photoUrl: "https://"
      }
    ],
    [
      OTHER_USER_ID,
      {
        name: "user2",
        photoUrl: "https://"
      }
    ]
  ]
};
const VALID_INITIATE_CHAT = {
  userIds: [VALID_USER_ID, OTHER_USER_ID]
};

describe("chat", () => {
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

  describe("create chat", () => {
    it("should require users to log in", async () => {
      const unAuthedDb = authedApp(projectId);
      const authedDb = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      const unAuthedChatRef = unAuthedDb.collection("chats").doc();
      const authedChat = authedDb.collection("chats").doc();

      await assertFails(unAuthedChatRef.set(VALID_INITIATE_CHAT));
      await assertSucceeds(authedChat.set(VALID_INITIATE_CHAT));
    });
    it("should require valid data", async () => {
      // Arrange
      const authedDb = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      const chat = authedDb.collection("chats").doc();

      // Act
      const createValidChat = chat.set(VALID_INITIATE_CHAT);
      const createInvalidChat = chat.set({ invalid: true });

      // Assert
      await assertSucceeds(createValidChat);
      // await assertFails(createInvalidChat);
    });
  });
});
