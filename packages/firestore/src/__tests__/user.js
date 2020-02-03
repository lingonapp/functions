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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@firebase/testing");
var testUtils_1 = require("../shared/testUtils");
var _a = testUtils_1.projectSetup({}), projectId = _a.projectId, coverageUrl = _a.coverageUrl, rules = _a.rules, generateUid = _a.generateUid;
var VALID_USER_ID = generateUid();
var OTHER_USER_ID = generateUid();
describe("user", function () {
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
    describe("create user", function () {
        it("should require users to log in before creating profile", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db, profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_1.authedApp(projectId);
                        profile = db.collection("users").doc(VALID_USER_ID);
                        return [4 /*yield*/, testing_1.assertFails(profile.set({ name: "Alice", isInNeed: false, photoUrl: "" }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should only let users create their own profile", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_1.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        return [4 /*yield*/, testing_1.assertSucceeds(db
                                .collection("users")
                                .doc(VALID_USER_ID)
                                .set({
                                name: "Alice",
                                photoUrl: "http://",
                                isInNeed: false
                            }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertFails(db
                                .collection("users")
                                .doc(OTHER_USER_ID)
                                .set({
                                name: "bob",
                                isInNeed: false,
                                photoUrl: "http"
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should enforce user model on create", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authenticatedFire, invalidDbSet, validDbSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authenticatedFire = testUtils_1.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        invalidDbSet = authenticatedFire
                            .collection("users")
                            .doc(VALID_USER_ID)
                            .set({
                            name: "Alice",
                            photoUrl: "http://",
                            isInNeed: false,
                            thisIsInvalidProp: "asg"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        });
                        validDbSet = authenticatedFire
                            .collection("users")
                            .doc(VALID_USER_ID)
                            .set({
                            name: "Alice",
                            photoUrl: "http://",
                            isInNeed: false
                        });
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(invalidDbSet)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertSucceeds(validDbSet)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("delete user", function () {
        it("should require user to log in", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authenticatedFire, deleteYourProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authenticatedFire = testUtils_1.authedApp(projectId);
                        deleteYourProfile = authenticatedFire
                            .collection("users")
                            .doc(VALID_USER_ID)
                            .delete();
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(deleteYourProfile)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should not allow delete your profile", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authenticatedFire, deleteYourProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authenticatedFire = testUtils_1.authedApp(projectId, { uid: VALID_USER_ID });
                        deleteYourProfile = authenticatedFire
                            .collection("users")
                            .doc(VALID_USER_ID)
                            .delete();
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(deleteYourProfile)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should not allow delete someone else profile", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authenticatedFire, deleteSomeElse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authenticatedFire = testUtils_1.authedApp(projectId, { uid: VALID_USER_ID });
                        deleteSomeElse = authenticatedFire
                            .collection("users")
                            .doc(OTHER_USER_ID)
                            .delete();
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(deleteSomeElse)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
