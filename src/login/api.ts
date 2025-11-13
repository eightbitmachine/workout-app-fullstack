import { useMutation } from "@tanstack/react-query";
import type { User } from "../../core/users";
import type { Credential } from "../../core/auth";
import { useContext } from "react";
import { deleteToken } from "../core/auth";
import { useRouter } from "@tanstack/react-router";
import { UserContext } from "./UserContext";

type LoginResponse =
  | {
      ok: false;
      error: string;
    }
  | {
      ok: true;
      user: User;
      token: string;
    };

function fetchAuthLogin(credential: Credential) {
  const body = new URLSearchParams(credential);

  return fetch("http://localhost:3001/auth/login", {
    method: "post",
    headers: {},
    body,
  }).then((response) => {
    console.log(`Response ${response.ok} ${response.status}`);
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((json) => Promise.reject(json));
    }
  });
}

function useLogin() {
  return useMutation({
    mutationFn: (credential: Credential): Promise<LoginResponse> => {
      return fetchAuthLogin(credential);
    },
  });
}

function useLogout() {
  const { setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  return () => {
    setCurrentUser(null);
    deleteToken();
    router.navigate({ to: "/login" });
  };
}

export { useLogin, useLogout };
