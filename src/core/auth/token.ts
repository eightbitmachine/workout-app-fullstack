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
}
