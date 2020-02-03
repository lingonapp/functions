"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DB_URL
});
const db = admin.firestore();
exports.onUserWrite = functions.firestore
    .document("users/hej")
    .onWrite(async (change, context) => {
    var _a, _b;
    const afterData = change.after.data();
    const userId = change.before.id;
    await db
        .doc(`locations/${userId}`)
        .set({ name: (_b = (_a = afterData) === null || _a === void 0 ? void 0 : _a.name, (_b !== null && _b !== void 0 ? _b : "")) }, { merge: true });
});
//# sourceMappingURL=index.js.map