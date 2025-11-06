import { type User, findActiveUser } from "./users";

const isValidEmail = (email: string) => {
  if (!email) {
    return { value: email, error: "EMAIL_EMPTY" };
  }

  if (!email.includes("@")) {
    return { value: email, error: "EMAIL_FORMAT" };
  }

  return { value: email, error: null };
};

const isValidPassword = (password: string) => {
  if (!password) {
    return { value: password, error: "PASSWORD_EMPTY" };
  }

  if (password.length <= 5) {
    return { value: password, error: "PASSWORD_LENGTH_SHORT" };
  }

  return { value: password, error: null };
};

type Credential = { email: string; password: string };

const createCredential = (
  email: string,
  password: string,
): { value: Credential; error: null } | { value: string; error: string } => {
  const validateEmailResult = isValidEmail(email);
  if (validateEmailResult.error) {
    return validateEmailResult;
  }

  const validatePasswordResult = isValidPassword(password);
  if (validatePasswordResult.error) {
    return validatePasswordResult;
  }

  return { value: { email, password }, error: null };
};

const validateCredential = (
  findUser: (
    email: Credential["email"],
  ) => Promise<{ value: string; error: string } | { value: User; error: null }>,
  credential: Credential,
) => {
  return findUser(credential.email)
    .then((result) => {
      return result;
    })
    .catch(() => {
      return { value: credential, error: "USER_NOT_FOUND" };
    });
};

const login = (credential: Credential) => {
  return validateCredential(findActiveUser, credential).then((result) => {
    if (!result.error) {
      console.log("Logged In");
    } else {
      console.log("Invalid User");
    }

    // TODO Maybe return more login specific result
    return result;
  });
};

export { createCredential, validateCredential, login, type Credential };
