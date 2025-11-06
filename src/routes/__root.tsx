import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { UserContext } from "../login/UserContext";
import { type User } from "../core/users";
import { useState } from "react"

const RootLayout = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); 

  return <>
      <UserContext value={{ currentUser, setCurrentUser }}>
        <Outlet />
        <TanStackRouterDevtools />
      </UserContext>
  </>
}

export const Route = createRootRoute({ component: RootLayout })
