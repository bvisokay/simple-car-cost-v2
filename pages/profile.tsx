import { useContext } from "react"
import { GlobalStateContext } from "../store/GlobalContext"

const Profile = () => {
  const appState = useContext(GlobalStateContext)

  return (
    <div>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{appState.loggedIn ? `LoggedIn from Context: ${appState.loggedIn}` : "false"}</p>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{appState.user.username ? `User from Context: ${appState.user.username.charAt(0).toUpperCase() + appState.user.username.slice(1)}` : "n/a"}</p>
    </div>
  )
}
export default Profile
