import type { User } from "@core/users";
import type { Credential } from "@core/auth";


export type LoginResponse =
  | {
      ok: false;
      error: string;
    }
  | {
      ok: true;
      user: User;
      token: string;
    };

export function fetchAuthLogin(credential: Credential) {
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

