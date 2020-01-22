"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var testing_1 = require("@firebase/testing");
exports.projectSetup = function (_a) {
    var _b = _a.rulesPath, rulesPath = _b === void 0 ? "firestore.rules" : _b;
    var projectId = "rules-spec-" + Date.now();
    var coverageUrl = "http://localhost:8080/emulator/v1/projects/" + projectId + ":ruleCoverage.html";
    var rules = fs_1.readFileSync(rulesPath, "utf8");
    var generateUid = function () {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        return randLetter + Date.now();
    };
    return {
        projectId: projectId,
        coverageUrl: coverageUrl,
        rules: rules,
        generateUid: generateUid
    };
};
exports.authedApp = function (projectId, auth) {
    if (!auth) {
        return testing_1.initializeTestApp({ projectId: projectId }).firestore();
    }
    return testing_1.initializeTestApp({
        projectId: projectId,
        auth: auth
    }).firestore();
};
exports.adminApp = function (projectId) {
    return testing_1.initializeAdminApp({ projectId: projectId }).firestore();
};
