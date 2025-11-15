import { createContext } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

import { type Credential } from "../../../core/auth";
import { type User } from "../../../core/users";

import type { LoginResponse } from "./api";

type AuthContextProps = {
  currentUser: User | null;
  setCurrentUser: ((user: User | null) => void);
  login?: UseMutationResult<LoginResponse, Error, Credential, unknown>
  logout?: VoidFunction
}

export const AuthContext = createContext<AuthContextProps>(
  { currentUser: null, setCurrentUser: () => { } }
)

