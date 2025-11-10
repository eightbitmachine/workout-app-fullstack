import {
  useState,
  useRef,
  useContext,
  type FormEventHandler,
  type FormEvent,
} from "react";
import { useRouter } from "@tanstack/react-router";
import { createCredential, login, type Credential } from "../../core/auth";
import { UserContext } from "./UserContext";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

type LoginHandlerFunction = (
  credential: Credential
) => ReturnType<typeof login>;

// Parse, don't validate
// TODO: Extract error and login handler so this is dumber component (presentational only)
type LoginFormProps = {
  loginHandler: LoginHandlerFunction;
};

const LoginForm = ({ loginHandler }: LoginFormProps) => {
  const { setCurrentUser } = useContext(UserContext);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState<string>();
  const [email, setEmail] = useState<string>();
  const emailInputRef = useRef(null);
  const router = useRouter();

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
    setIsWaiting(true);

    const formData = new FormData(event.currentTarget);
    const formEmail = formData.get("email")?.toString() || "";
    const formPassword = formData.get("password")?.toString() || "";
    const credentialResult = createCredential(formEmail, formPassword);

    if (credentialResult.error == null) {
      const credential = credentialResult.value;

      loginHandler(credential)
        .then((result) => {
          if (result.error === null) {
            setCurrentUser(result.value);
            router.navigate({ to: "/dashboard" }).then(() => { });
          } else {
            setEmail(formEmail);
            setError(result.error);
            console.log(result);
          }
        })
        .finally(() => {
          setIsWaiting(false);
        });
    } else {
      setIsWaiting(false);
      setEmail(formEmail);
      setError(credentialResult.error);
      console.log(credentialResult);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-700 rounded border-solid p-8"
    >
      <div className="text-base mb-8 flex flex-row gap-4 justify-between">
        <label htmlFor="email" className="text-right">
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

      <div
        data-testid="login-error"
        className={error ? "p-2 bg-red-800 text-white" : "hidden"}
      >
        {error ? humanErrorMessage[error] : ""}
      </div>

      <div>
        <button type="submit">{isWaiting ? "Logging in" : "Login"}</button>
      </div>
    </form>
  );
};

export { LoginForm, type LoginHandlerFunction, type LoginFormElement };
