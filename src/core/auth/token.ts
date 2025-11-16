import type { User } from "@core/users";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const TOKEN_NAME = "token";

export function saveToken(token: string) {
  return window.localStorage.setItem(TOKEN_NAME, token);
}

export function loadToken() {
  return window.localStorage.getItem(TOKEN_NAME);
}

export function deleteToken() {
  window.localStorage.removeItem(TOKEN_NAME);
}

export function loadDecodedToken() {
  const token = loadToken();
  return token ? decodeToken(token) : null;
}

type UserPayload = Pick<JwtPayload, "exp" | "nbf" | "iat"> & User;

export function decodeToken(token: string) {
  try {
    const data = jwtDecode<UserPayload>(token);
    return data;
  } catch (e: unknown) {
    console.log((e as Error).message);
  }

  return null;
}

// TODO: Needs a unit test
export function isAliveToken(decodedToken: UserPayload) {
  const now = Math.floor(Date.now() / 1000);
  const isExpired = decodedToken.exp && now >= decodedToken.exp;
  if (isExpired) {
    return { ok: false, error: new Error("TOKEN_EXPIRE") };
  }

  const isBefore = decodedToken.nbf && now <= decodedToken.nbf;
  if (isBefore) {
    return { ok: false, error: new Error("TOKEN_NOT_BEFORE") };
  }

  return { ok: true };
}
