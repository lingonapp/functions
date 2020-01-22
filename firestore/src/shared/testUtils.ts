import { readFileSync } from "fs";
import {
  initializeTestApp,
  firestore,
  initializeAdminApp
} from "@firebase/testing";

export const projectSetup = ({
  rulesPath = "firestore.rules"
}: {
  rulesPath?: string;
}): {
  projectId: string;
  coverageUrl: string;
  rules: string;
  generateUid: () => string;
} => {
  const projectId = `rules-spec-${Date.now()}`;
  const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;
  const rules = readFileSync(rulesPath, "utf8");
  const generateUid = (): string => {
    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return randLetter + Date.now();
  };
  return {
    projectId,
    coverageUrl,
    rules,
    generateUid
  };
};

export const authedApp = (projectId: string, auth?: object) => {
  if (!auth) {
    return initializeTestApp({ projectId }).firestore();
  }
  return initializeTestApp({
    projectId,
    auth
  }).firestore();
};

export const adminApp = (projectId: string) => {
  return initializeAdminApp({ projectId }).firestore();
};
