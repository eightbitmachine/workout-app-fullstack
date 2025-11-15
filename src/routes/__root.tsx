import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "../core/auth/provider";
import { type User } from "../../core/users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // throwOnError: true
    },
    mutations: {
      // thrownOnError: true
    },
  },
});

const RootLayout = () => {
  // TODO: Package loading the user into custom context provider or hook?
  //
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
          <TanStackRouterDevtools />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

interface AppRouterContext {
  auth: { user: User };
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});
