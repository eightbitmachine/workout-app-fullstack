import argon2 from "argon2";

const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password);
  return hash;
};

const verifyPassword = async (hash: string, password: string) => {
  const isValid = await argon2.verify(hash, password);
  return isValid;
};

export { hashPassword, verifyPassword };
