import { adminApp } from "./../shared/testUtils";
import {
  firestore,
  apps,
  loadFirestoreRules,
  clearFirestoreData,
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
  usersMap: {
    [VALID_USER_ID]: {
      name: "user1",
      photoUrl: "https://"
    },
    [OTHER_USER_ID]: {
      name: "user2",
      photoUrl: "https://"
    }
  }
};
const VALID_CHAT_MESSAGE = {
  from: {
    name: "name1",
    photoUrl: "https://"
  },
  text: "string",
  timestamp: "string",
  type: 1
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

  describe("create chat message", () => {
    it("should have to be a member in the chat", async () => {
      // Arrange
      const adminDb = adminApp(projectId);
      const authedDb = authedApp(projectId, {
        uid: VALID_USER_ID
      });
      await adminDb
        .collection("chats")
        .doc("123")
        .set(VALID_CHAT);
      const authedChat = authedDb
        .collection("chats")
        .doc("123")
        .collection("messages")
        .doc();

      await assertSucceeds(authedChat.set(VALID_CHAT_MESSAGE));
      const data = await authedChat.get();
      console.log(data.data());
    });
  });
});
