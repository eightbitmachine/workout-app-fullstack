import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { type QueryClient } from "@tanstack/react-query";

import { type AuthState } from "../core/auth/context";

const RootLayout = () => {
  // TODO: Package loading the user into custom context provider or hook?
  //
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="top-right" initialIsOpen={false} />
    </>
  );
};

interface AppRouterContext {
  auth: AuthState;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});
