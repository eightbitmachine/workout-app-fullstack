import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { createCredential, login } from "../core/auth";

type LoginFormProps = {
  errors: {
    email?: string[]
    password?: string[]
    login: string[]
  }
  email: string
}

// Parse, don't validate
const LoginForm = ({ email, errors }: LoginFormProps) => {
  const router = useRouter();

  const [isWaiting, setIsWaiting] = useState(false);

  const handleLogin = (formData: FormData) => {
    setIsWaiting(true);

    const email = formData.get("email")?.toString() || ""
    const password = formData.get("password")?.toString() || ""

    const result = createCredential(email, password)
    if (!result.error) {
      const credential = result.value;
      console.log(credential);
      router.navigate({ to: "/dashboard" }).then(() => {
        setIsWaiting(false);
      })
    } else {
      console.log(result)
    }

    setIsWaiting(false);
  }

  return <form action={handleLogin}>
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />
    </div>
    <div className="errors">
      {(errors && errors["email"] && errors["email"].length > 0) ? errors["email"].map((e: string) => <p>{e}</p>) : null}
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password"></input>
    </div>
    <div><button type="submit">{(isWaiting) ? "Logging in" : "Login"}</button></div>
  </form >
}

export { LoginForm }
