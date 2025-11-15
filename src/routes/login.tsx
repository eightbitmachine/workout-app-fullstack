import { createFileRoute } from "@tanstack/react-router";

import { type Credential } from "../../core/auth";

import { LoginForm } from "../login/LoginForm";
import { useAuth } from "../core/auth/useAuth";

import "../style.css";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login: loginMutation } = useAuth();

  const handleLogin = (credential: Credential) => {
    if (loginMutation) {
      loginMutation.mutate(credential);
    }
  };

  return (
    <div className="w-3/5 flex flex-col flex-wrap text-left">
      {loginMutation?.isPending ? <div>Logging in&hellip;</div> : ""}
      {loginMutation?.isSuccess ? (
        <div>Logged in! Redirecting to Dashboard&hellip;</div>
      ) : (
        ""
      )}
      {loginMutation?.isError ? (
        <div className="mb-2 border-2 border-solid rounded border-amber-400 bg-amber-100 p-2">
          <p className="font-bold text-lg text-amber-950">
            We were unable to log you in.
          </p>
          <p> Please check the credentials that you've provided.</p>
        </div>
      ) : (
        ""
      )}
      {loginMutation?.isIdle || loginMutation?.isError ? (
        <LoginForm loginHandler={handleLogin} />
      ) : (
        ""
      )}
    </div>
  );
}
