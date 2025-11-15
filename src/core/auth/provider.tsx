import { useState, useEffect, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

import { type User } from "../../../core/users.ts";
import { type Credential } from "../../../core/auth.ts";

import { AuthContext } from "./context.tsx";
import { deleteToken, loadDecodedToken, saveToken } from "./token.ts";
import { fetchAuthLogin, type LoginResponse } from "./api.ts";

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  // Load the current User from the session (token in localStorage) is one is present.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = useMutation({
    mutationFn: (credential: Credential): Promise<LoginResponse> => {
      return fetchAuthLogin(credential);
    },

    onSuccess(data) {
      if (data.ok) {
        setCurrentUser(data.user);
        saveToken(data.token);
        redirect({ to: "/dashboard" });
        // setTimeout(() => { router.navigate({ to: "/dashboard" }) }, 375)
      }
    },
  });

  const logout = () => {
    if (currentUser) {
      setCurrentUser(null);
      deleteToken();
      redirect({ to: "/login" });
    }
  };

  useEffect(() => {
    const token = loadDecodedToken();
    if (token) {
      setCurrentUser({
        id: token.id,
        email: token.email,
        type: token.type,
      });
    }
  }, []);

  return (
    <AuthContext value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </AuthContext>
  );
};
