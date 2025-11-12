import { useContext } from "react"
import { UserContext } from "../login/UserContext"
import { useLogout } from "../login/api";


const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const logout = useLogout();

  const handleLogout = () => {
    if (currentUser) {
      logout();
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
