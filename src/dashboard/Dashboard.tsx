import { useContext } from "react"
import { UserContext } from "../login/UserContext"
import { logout } from "../../core/auth";
import { useRouter } from "@tanstack/react-router";


const Dashboard = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = () => {
    if (currentUser) {
      logout(currentUser?.email).then(() => {
        setCurrentUser(null);
        router.navigate({ to: "/login" })
      });
    }
  }


  return <div>
    <header>
      <nav>
        <button onClick={handleLogout} className="cursor-pointer">Logout</button>
      </nav>
    </header>

    <main>
      <h1>Welcome, {currentUser?.email}</h1>
      <p>This is a stub of the Dashboard</p>
    </main>

    <footer>
    </footer>
  </div>
}


export { Dashboard }
