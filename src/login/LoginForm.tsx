import {
  useState,
  useRef,
  type FormEventHandler,
  type FormEvent,
} from "react";
import { createCredential, type Credential } from "../../core/auth";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

type LoginHandlerFunction = (
  credential: Credential
) => unknown;

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
      loginHandler(credentialResult.credential)
    } 
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-700 rounded border-solid p-8"
    >
      <div className="text-base mb-8 flex flex-row gap-4 justify-between items-center ">
        <label htmlFor="email" className="text-right block">
          Email
        </label>
        <input
          ref={emailInputRef}
          defaultValue={email}
          id="email"
          name="email"
          type="email"
          className="border border-solid border-gray-600 text-black"
        />
      </div>
      {(error?.startsWith('EMAIL_')) ? <div className="p-2 bg-red-400">{humanErrorMessage[error]}</div>:''}
      <div className="text-base mb-8 flex flex-row gap-4 justify-between">
        <label htmlFor="password" className="text-right">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="border border-solid border-gray-600 text-black"
        ></input>
      </div>
      {(error?.startsWith('PASSWORD_')) ? <div className="p-2 bg-red-400 text-white">{humanErrorMessage[error]}</div>:''}

      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
};

export { LoginForm, type LoginHandlerFunction, type LoginFormElement };
