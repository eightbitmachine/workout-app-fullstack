import { createFileRoute, redirect } from "@tanstack/react-router";
import { Dashboard } from "../dashboard/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad({ context, location }) {
    const isAuthenticated = (context.auth.isAuthenticated) ? context.auth.isAuthenticated() : false;
    if (!isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function RouteComponent() {
  return <Dashboard />;
}
