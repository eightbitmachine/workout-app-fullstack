import type { User } from "@core/users";
import { jwtDecode, type JwtPayload } from "jwt-decode";

export function saveToken(token: string) {
  return window.localStorage.setItem("token", token);
}

export function loadToken() {
  return window.localStorage.getItem("token")
}

export function deleteToken() {
  window.localStorage.removeItem("token");
}

export function loadDecodedToken() {
  const token = loadToken();
  return (token) ? decodeToken(token) : null;
}

type UserPayload = Pick<JwtPayload, "exp" | "nbf" | "iat"> & User;

export function decodeToken(token: string) {
  try {
    const data = jwtDecode<UserPayload>(token);
    return data;
  } catch (e: unknown) {
    console.log((e as Error).message)
  }
}
