"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions-test"));
const admin = __importStar(require("firebase-admin"));
const myFunctions = __importStar(require("../"));
const generatePushID_1 = __importDefault(require("../../src/generatePushID"));
const config = {
    databaseURL: process.env.FIREBASE_DB_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
const firebaseTest = functions.default(config, process.env.GOOGLE_APPLICATION_CREDENTIALS);
const VALID_USER_ID = generatePushID_1.default();
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
        var _a;
        // expect.assertions(1);
        // Arrange
        const beforeSnap = firebaseTest.firestore.makeDocumentSnapshot({ name: "name_before" }, `users/${VALID_USER_ID}`);
        const afterSnap = firebaseTest.firestore.makeDocumentSnapshot({ name: "name_after" }, `users/${VALID_USER_ID}`);
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
        expect((_a = data) === null || _a === void 0 ? void 0 : _a.name).toBe("name_after");
    });
});
//# sourceMappingURL=user.spec.js.map