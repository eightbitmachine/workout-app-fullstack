type Credential = { email: string; password: string };
type CredentialError =
  | "EMAIL_EMPTY"
  | "EMAIL_FORMAT"
  | "PASSWORD_EMPTY"
  | "PASSWORD_LENGTH_SHORT";

const isValidEmail = (
  email: string
): { ok: true } | { ok: false; error: CredentialError } => {
  if (!email) {
    return { ok: false, error: "EMAIL_EMPTY" };
  }

  if (!email.includes("@")) {
    return { ok: false, error: "EMAIL_FORMAT" };
  }

  return { ok: true };
};

const isValidPassword = (
  password: string
): { ok: true } | { ok: false; error: CredentialError } => {
  if (!password) {
    return { ok: false, error: "PASSWORD_EMPTY" };
  }

  if (password.length <= 5) {
    return { ok: false, error: "PASSWORD_LENGTH_SHORT" };
  }

  return { ok: true };
};

const createCredential = (
  email: string,
  password: string
):
  | { ok: true; credential: Credential }
  | { ok: false; error: CredentialError } => {
  const validateEmailResult = isValidEmail(email);
  if (!validateEmailResult.ok) {
    return validateEmailResult;
  }

  const validatePasswordResult = isValidPassword(password);
  if (!validatePasswordResult.ok) {
    return validatePasswordResult;
  }

  return { ok: true, credential: { email, password } };
};


export { createCredential, type Credential, type CredentialError };
