import { useContext } from "react"
import { UserContext } from "../login/UserContext"


const Dashboard = () => {
  const { currentUser } = useContext(UserContext);

  return <div>
    <header>
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
