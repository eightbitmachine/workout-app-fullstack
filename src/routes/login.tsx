import { useContext } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { type Credential } from "../../core/auth";
import { useLogin } from "../login/api";

import { LoginForm } from "../login/LoginForm";
import { UserContext } from "../login/UserContext";
import { saveToken } from "../core/auth";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setCurrentUser } = useContext(UserContext);
  const mutation = useLogin();
  const router = useRouter();

  const handleLogin = (credential: Credential) => {
    mutation.mutate(credential, {
      onSuccess(data) {
        if (data.ok) {
          setCurrentUser(data.user);
          saveToken(data.token);
          router.navigate({ to: "/dashboard" });
          // setTimeout(() => { router.navigate({ to: "/dashboard" }) }, 375)
        }
      },
    });
  }

  return (
    <div>
      {mutation.isPending ? <div>Logging in&hellip;</div> : ''}
      {mutation.isSuccess ? <div>Logged in! Redirecting to Dashboard&hellip;</div> : ''}
      {mutation.isError ? <div>We were not able to log you in. Please check the credentials that you've provided.</div> : ''}
      {(mutation.isIdle || mutation.isError) ? <LoginForm loginHandler={handleLogin} /> : ''}
    </div>
  );
}
