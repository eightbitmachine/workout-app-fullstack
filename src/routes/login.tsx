import { createFileRoute } from "@tanstack/react-router";
import { login, type Credential } from "../../core/auth";
import { LoginForm } from "../login/LoginForm";
import { useLogin } from "../login/api";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

// TODO: Consider using a reducer via `useReduce` to 
// manage the different states:
// - Not Logged In
// - Unsuccessful Log In
// - Successful Login (store token in localStorage)
// Form states such as invalid input should be kept local to the form.
// The form itself does not need to be aware of what we're doing after login.
function RouteComponent() {
  // TODO: Perhaps the `login` needs to be via something like `useLogin` that
  // will run the fetch as an effect and return a dispatch action?

  // For localStorage, we can use a third-party useLocalStorage hook 
  // and perhaps we have some root/app level state that we'll track the locally
  // stored token in

  // The `login` method used here would have to change. If we change `login` (maybe renamed to `useLogin`) to run a fetch request,
  // then we need a wrapper around it that can deal with the UI things like state updates/dispatcher etc 
  // instead of running the effect directly/imperatively

  const loginMutation = useLogin();

  return (
    <div>
      {(loginMutation.isSuccess) ? <output>{JSON.stringify(loginMutation.data)}</output> : ''}
      <LoginForm loginHandler={(credential: Credential) => {
        loginMutation.mutate(credential);
        return login(credential);
      }} />
    </div>
  );
}
