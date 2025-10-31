import { useState, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { createCredential, login } from "../core/auth";

// Parse, don't validate
// TODO: Extract error and login handler so this is dumber component (presentational only)
const LoginForm = () => {
  const router = useRouter();

  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState<string>();
  const [email, setEmail] = useState<string>();
  const emailInputRef = useRef(null);

  const humanErrorMessage: { [index: string]: string } = {
    'EMAIL_FORMAT': "Your email address was not correctly formatted. Ensure it contains an @ symbol.",
    'EMAIL_EMPTY': "Please provide your email address.",
    'PASSWORD_EMPTY': "Please provide your password.",
    'PASSWORD_LENGTH_SHORT': "The password you provided was too short.",
    'USER_NOT_FOUND': "Invalid credentials"
  }

  const handleLogin = (formData: FormData) => {
    setIsWaiting(true);

    const formEmail = formData.get("email")?.toString() || ""
    const formPassword = formData.get("password")?.toString() || ""

    const result = createCredential(formEmail, formPassword)
    if (result.error == null) {
      const credential = result.value;

      login(credential).then(result => {
        if (!result.error) {
          router.navigate({ to: "/dashboard" }).then(() => {
            setIsWaiting(false);
          })
        } else {
          console.log(result)
          setEmail(formEmail);
          setError(result.error)
        }
      })
    } else {
      console.log(result)
      setEmail(formEmail);
      setError(result.error)
    }

    setIsWaiting(false);
  }

  return <form action={handleLogin} className="border border-gray-700 rounded border-solid p-8">
    <div className="text-base mb-8 flex flex-row gap-4 justify-between">
      <label htmlFor="email" className="text-right">Email</label>
      <input ref={emailInputRef} defaultValue={email} id="email" name="email" type="email" className="border border-solid border-gray-600 text-black" />
    </div>
    <div className="text-base mb-8 flex flex-row gap-4 justify-between">
      <label htmlFor="password" className="text-right">Password</label>
      <input id="password" name="password" type="password" className="border border-solid border-gray-600 text-black"></input>
    </div>

    <div data-testid="login-error" className={(error) ? "p-2 bg-red-800 text-white" : "hidden"}>
      {(error) ? humanErrorMessage[error] : ''}
    </div>

    <div><button type="submit">{(isWaiting) ? "Logging in" : "Login"}</button></div>
  </form >
}

export { LoginForm }
