import { useState, useRef, type FormEventHandler, type FormEvent } from "react";
import { createCredential, type Credential } from "../../core/auth";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

type LoginHandlerFunction = (credential: Credential) => unknown;

// Parse, don't validate
// TODO: Extract error and login handler so this is dumber component (presentational only)
type LoginFormProps = {
  loginHandler: LoginHandlerFunction;
};

const LoginForm = ({ loginHandler }: LoginFormProps) => {
  const [error, setError] = useState<string>();
  const [email, setEmail] = useState<string>();
  const emailInputRef = useRef(null);

  const humanErrorMessage: { [index: string]: string } = {
    EMAIL_FORMAT:
      "Your email address was not correctly formatted. Ensure it contains an @ symbol.",
    EMAIL_EMPTY: "Please provide your email address.",
    PASSWORD_EMPTY: "Please provide your password.",
    PASSWORD_LENGTH_SHORT: "The password you provided was too short.",
    USER_NOT_FOUND: "Invalid credentials",
  };

  const handleSubmit: FormEventHandler = (
    event: FormEvent<LoginFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const credentialResult = createCredential(email, password);

    if (!credentialResult.ok) {
      setEmail(email);
      setError(credentialResult.error);
    } else {
      loginHandler(credentialResult.credential);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-slate-200 rounded border-solid p-8 flex flex-col"
    >
      <div className="text-base mb-2 gap-2 flex flex-col items-start">
        <label htmlFor="email" className="block font-semi-bold">
          Email
        </label>
        <input
          ref={emailInputRef}
          defaultValue={email}
          id="email"
          name="email"
          type="email"
          className="border border-solid border-slate-200 rounded text-black"
        />
      </div>
      {error?.startsWith("EMAIL_") ? (
        <div className="text-red-400 mb-2">{humanErrorMessage[error]}</div>
      ) : (
        ""
      )}
      <div className="text-base mb-2 gap-2 flex flex-col items-start">
        <label htmlFor="password" className="block font-semi-bold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="border border-solid border-slate-200 rounded text-black"
        ></input>
      </div>
      {error?.startsWith("PASSWORD_") ? (
        <div className="text-red-400 mb-2">{humanErrorMessage[error]}</div>
      ) : (
        ""
      )}
      <div className="flex flex-row">
        <button type="submit" className="bg-blue-500">
          Login
        </button>
      </div>
    </form>
  );
};

export { LoginForm, type LoginHandlerFunction, type LoginFormElement };
