import { createFileRoute } from "@tanstack/react-router";
import { login } from "../core/auth";
import { LoginForm } from "../login/LoginForm";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LoginForm loginHandler={login} />
    </div>
  );
}
