"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var testUtils_1 = require("./../shared/testUtils");
var testing_1 = require("@firebase/testing");
var app_1 = __importDefault(require("firebase/app"));
var testUtils_2 = require("../shared/testUtils");
/*
 * ============
 *    Setup
 * ============
 */
var _a = testUtils_2.projectSetup({}), projectId = _a.projectId, coverageUrl = _a.coverageUrl, rules = _a.rules, generateUid = _a.generateUid;
var VALID_USER_ID = generateUid();
var OTHER_USER_ID = generateUid();
var VALID_LOCATION_REQUEST = {
    inNeedOf: 0,
    isInNeed: true,
    name: "name-" + VALID_USER_ID,
    position: {
        geohash: "123",
        geopoint: new app_1.default.firestore.GeoPoint(20, 10)
    }
};
describe("location", function () {
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
    describe("create location", function () {
        it("should require user to log in", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db, location, createdLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_2.authedApp(projectId);
                        location = db.collection("locations").doc(VALID_USER_ID);
                        createdLocation = location.set(VALID_LOCATION_REQUEST);
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(createdLocation)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("can only create your own location", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db, yourLocation, othersLocation, createdYourLocation, createdOthersLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_2.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        yourLocation = db.collection("locations").doc(VALID_USER_ID);
                        othersLocation = db.collection("locations").doc(OTHER_USER_ID);
                        createdYourLocation = yourLocation.set(VALID_LOCATION_REQUEST);
                        createdOthersLocation = othersLocation.set(VALID_LOCATION_REQUEST);
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(createdOthersLocation)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertSucceeds(createdYourLocation)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should require valid data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db, location, createdInvalidLocation, createdValidLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_2.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        location = db.collection("locations").doc(VALID_USER_ID);
                        createdInvalidLocation = location.set({ invalid: true });
                        createdValidLocation = location.set(VALID_LOCATION_REQUEST);
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(createdInvalidLocation)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertSucceeds(createdValidLocation)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("read location", function () {
        it("should require user to log in", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db, location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_2.authedApp(projectId);
                        location = db.collection("locations").doc(VALID_USER_ID);
                        return [4 /*yield*/, testing_1.assertFails(location.get())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should be able to read all locations", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db, yourLocation, otherLocation, gotYourProfile, gotOtherProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_2.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        yourLocation = db.collection("locations").doc(VALID_USER_ID);
                        otherLocation = db.collection("locations").doc(OTHER_USER_ID);
                        gotYourProfile = yourLocation.get();
                        gotOtherProfile = otherLocation.get();
                        // Assert
                        return [4 /*yield*/, testing_1.assertSucceeds(gotYourProfile)];
                    case 1:
                        // Assert
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertSucceeds(gotOtherProfile)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("update location", function () {
        it("should require user to log in", function () { return __awaiter(void 0, void 0, void 0, function () {
            var db, location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = testUtils_2.authedApp(projectId);
                        location = db.collection("locations").doc(VALID_USER_ID);
                        return [4 /*yield*/, testing_1.assertFails(location.update(VALID_LOCATION_REQUEST))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("can only update your own location", function () { return __awaiter(void 0, void 0, void 0, function () {
            var adminDb, db, yourLocation, othersLocation, updatedYourLocation, updatedOthersLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminDb = testUtils_1.adminApp(projectId);
                        db = testUtils_2.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        return [4 /*yield*/, adminDb
                                .collection("locations")
                                .doc(VALID_USER_ID)
                                .set(VALID_LOCATION_REQUEST)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adminDb
                                .collection("locations")
                                .doc(OTHER_USER_ID)
                                .set(VALID_LOCATION_REQUEST)];
                    case 2:
                        _a.sent();
                        yourLocation = db.collection("locations").doc(VALID_USER_ID);
                        othersLocation = db.collection("locations").doc(OTHER_USER_ID);
                        updatedYourLocation = yourLocation.update(__assign(__assign({}, VALID_LOCATION_REQUEST), { isInNeed: false }));
                        updatedOthersLocation = othersLocation.update(__assign(__assign({}, VALID_LOCATION_REQUEST), { isInNeed: false }));
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(updatedOthersLocation)];
                    case 3:
                        // Assert
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertSucceeds(updatedYourLocation)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("can only update with valid data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var adminDb, db, yourLocation, updateWithValidData, updateWithInValidData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminDb = testUtils_1.adminApp(projectId);
                        db = testUtils_2.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        return [4 /*yield*/, adminDb
                                .collection("locations")
                                .doc(VALID_USER_ID)
                                .set(VALID_LOCATION_REQUEST)];
                    case 1:
                        _a.sent();
                        yourLocation = db.collection("locations").doc(VALID_USER_ID);
                        updateWithValidData = yourLocation.update(__assign(__assign({}, VALID_LOCATION_REQUEST), { inNeedOf: 1 }));
                        updateWithInValidData = yourLocation.update({ invalid: true });
                        // Assert
                        return [4 /*yield*/, testing_1.assertSucceeds(updateWithValidData)];
                    case 2:
                        // Assert
                        _a.sent();
                        return [4 /*yield*/, testing_1.assertFails(updateWithInValidData)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("delete location", function () {
        it("can't delete your own", function () { return __awaiter(void 0, void 0, void 0, function () {
            var adminDb, db, yourLocation, deleteYourLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminDb = testUtils_1.adminApp(projectId);
                        db = testUtils_2.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        return [4 /*yield*/, adminDb
                                .collection("locations")
                                .doc(VALID_USER_ID)
                                .set(VALID_LOCATION_REQUEST)];
                    case 1:
                        _a.sent();
                        yourLocation = db.collection("locations").doc(VALID_USER_ID);
                        deleteYourLocation = yourLocation.delete();
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(deleteYourLocation)];
                    case 2:
                        // Assert
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("can't delete others", function () { return __awaiter(void 0, void 0, void 0, function () {
            var adminDb, db, othersLocation, deleteOthersLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminDb = testUtils_1.adminApp(projectId);
                        db = testUtils_2.authedApp(projectId, {
                            uid: VALID_USER_ID
                        });
                        return [4 /*yield*/, adminDb
                                .collection("locations")
                                .doc(OTHER_USER_ID)
                                .set(VALID_LOCATION_REQUEST)];
                    case 1:
                        _a.sent();
                        othersLocation = db.collection("locations").doc(OTHER_USER_ID);
                        deleteOthersLocation = othersLocation.delete();
                        // Assert
                        return [4 /*yield*/, testing_1.assertFails(deleteOthersLocation)];
                    case 2:
                        // Assert
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
