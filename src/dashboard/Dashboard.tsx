import { useContext } from "react"
import { useNavigate } from "@tanstack/react-router"

import { AuthContext } from "../core/auth/context"


const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate({ to: '/login' })
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
