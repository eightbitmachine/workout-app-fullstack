import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserContext } from "../login/UserContext";
import { type User } from "../../core/users";

const queryClient = new QueryClient();

const RootLayout = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext value={{ currentUser, setCurrentUser }}>
          <Outlet />
          <TanStackRouterDevtools />
        </UserContext>
      </QueryClientProvider>
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
