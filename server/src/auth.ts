import argon2 from "argon2";
import { sign, verify } from "hono/jwt";

import type { User } from "./db/users.js";

const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password);
  return hash;
};

const verifyPassword = async (hash: string, password: string) => {
  const isValid = await argon2.verify(hash, password);
  return isValid;
};

const createJWT = (
  secret: string,
  expiryDurationInSeconds: number,
  payload: object,
) => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    ...payload,
    iat: nowInSeconds,
    nbf: nowInSeconds,
    exp: nowInSeconds + expiryDurationInSeconds,
  };

  return sign(jwtPayload, secret, "HS256");
};

const verifyJWT = async (secret: string, token: string) => {
  return verify(token, secret, "HS256");
};

const authJWT = async (secret: string, user: User) => {
  const fiveMinuteExpiry = 5 * 60;
  return createJWT(secret, fiveMinuteExpiry, user);
};

export { hashPassword, verifyPassword, authJWT, verifyJWT };
