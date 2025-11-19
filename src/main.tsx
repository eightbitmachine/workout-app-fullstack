import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAuth } from "./core/auth/useAuth";
import { AuthProvider } from "./core/auth/provider";

import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true
    },
    mutations: {
      throwOnError: true
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

// NOTE: `Auth` could have been simply a custom hook? But I'm going to stick with it as context
// so it functions as a singleton for easier accesss to the `currentUser` where needed for now.
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
