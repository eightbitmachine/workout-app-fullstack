import { createContext } from "react";
import { type User } from "../../core/users";

type UserContextProps = {
  currentUser: User | null;
  setCurrentUser: ((user: User | null) => void);
}

export const UserContext = createContext<UserContextProps>(
  { currentUser: null, setCurrentUser: () => { } }
)
