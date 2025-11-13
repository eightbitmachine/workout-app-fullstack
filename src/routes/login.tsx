import { useContext } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { type Credential } from "../../core/auth";
import { useLogin } from "../login/api";

import { LoginForm } from "../login/LoginForm";
import { UserContext } from "../login/UserContext";
import { saveToken } from "../core/auth";

import "../style.css";

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
  };

  return (
    <div className="w-3/5 flex flex-col flex-wrap text-left">
      {mutation.isPending ? <div>Logging in&hellip;</div> : ""}
      {mutation.isSuccess ? (
        <div>Logged in! Redirecting to Dashboard&hellip;</div>
      ) : (
        ""
      )}
      {mutation.isError ? (
        <div className="mb-2 border-2 border-solid rounded border-amber-400 bg-amber-100 p-2">
          <p className="font-bold text-lg text-amber-950">
            We were unable to log you in.
          </p>
          <p> Please check the credentials that you've provided.</p>
        </div>
      ) : (
        ""
      )}
      {mutation.isIdle || mutation.isError ? (
        <LoginForm loginHandler={handleLogin} />
      ) : (
        ""
      )}
    </div>
  );
}
