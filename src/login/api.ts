import { useMutation } from "@tanstack/react-query";
import type { User } from "../../core/users";
import type { Credential } from "../../core/auth";

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

function useLogin() {
  return useMutation({
    mutationFn: (credential: Credential): Promise<LoginResponse> => {
      const body = new URLSearchParams(credential);

      return fetch("http://localhost:3001/auth/login", {
        method: "post",
        headers: {},
        body,
      }).then((response) => response.json());
    },
  });
}

export { useLogin };
