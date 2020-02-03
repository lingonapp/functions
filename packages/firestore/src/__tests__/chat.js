"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@firebase/testing");
var testUtils_1 = require("../shared/testUtils");
/*
 * ============
 *    Setup
 * ============
 */
var _b = testUtils_1.projectSetup({}), projectId = _b.projectId, coverageUrl = _b.coverageUrl, rules = _b.rules, generateUid = _b.generateUid;
var VALID_USER_ID = generateUid();
var OTHER_USER_ID = generateUid();
var VALID_CHAT = {
    userIds: [VALID_USER_ID, OTHER_USER_ID],
    latestMessage: {
        createdAt: "2019",
        text: "chattext",
        from: {
            name: "user1",
            photoUrl: "https://"
        }
    },
    users: (_a = {},
        _a[VALID_USER_ID] = {
            name: "user1",
            photoUrl: "https://"
        },
        _a[OTHER_USER_ID] = {
            name: "user2",
            photoUrl: "https://"
        },
        _a)
};
var VALID_INITIATE_CHAT = {
    userIds: [VALID_USER_ID, OTHER_USER_ID]
};
describe("chat", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.loadFirestoreRules({ projectId: projectId, rules: rules })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.clearFirestoreData({ projectId: projectId })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(testing_1.apps().map(function (app) { return app.delete(); }))];
                case 1:
                    _a.sent();
                    console.log("View rule coverage information at " + coverageUrl + "\n");
                    return [2 /*return*/];
            }
        });
    }); });
    describe("create chat", function () {
        it("should require users to log in", function () { return __awaiter(void 0, void 0, void 0, function () {
            var unAuthedDb, authedDb, unAuthedChatRef, authedChat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unAuthedDb = testUtils_1.authedApp(projectId);
                        authedDb = testUtils_1.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        unAuthedChatRef = unAuthedDb.collection("chats").doc();
                        authedChat = authedDb.collection("chats").doc();
                        return [4 /*yield*/, testing_1.assertFails(unAuthedChatRef.set(VALID_INITIATE_CHAT))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertSucceeds(authedChat.set(VALID_INITIATE_CHAT))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should require valid data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authedDb, chat, createValidChat, createInvalidChat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authedDb = testUtils_1.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        chat = authedDb.collection("chats").doc();
                        createValidChat = chat.set(VALID_INITIATE_CHAT);
                        createInvalidChat = chat.set({ invalid: true });
                        // Assert
                        return [4 /*yield*/, testing_1.assertSucceeds(createValidChat)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertFails(createInvalidChat)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
