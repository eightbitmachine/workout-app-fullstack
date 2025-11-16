import { createContext } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

import { type Credential } from "../../../core/auth";
import { type User } from "../../../core/users";

import type { LoginResponse } from "./api";


export type AuthState = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login?: UseMutationResult<LoginResponse, Error, Credential, unknown>;
  logout?: VoidFunction;
  isAuthenticated?: () => boolean;
};

// TODO: May be better to have `null | AuthState`. Either the AuthState is usable or it isn't.
export const AuthContext = createContext<AuthState>({
  currentUser: null,
  setCurrentUser: () => { },
  isAuthenticated: () => {
    // BUG: This is not being overwritten in the Router context
    // This has something to do with the order in which the RouterWithContext is created
    // or used before we get to the components wrapped in AuthProvider
    // May need to extract a Router component as in the TanStack example
    console.log("Called dummy isAuthenticate");
    return false;
  },
});
