import { useContext } from "react"
import { GlobalStateContext } from "../store/GlobalContext"
import { useState } from "react"

const Profile = (props: any) => {
  const appState = useContext(GlobalStateContext)
  const [appUser, setAppUser] = useState(props.initialAppUser)

  return (
    <div>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{appState.loggedIn ? `LoggedIn from Context: ${appState.loggedIn}` : "false"}</p>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{appState.user.username ? `User from Context: ${appState.user.username.charAt(0).toUpperCase() + appState.user.username.slice(1)}` : "n/a"}</p>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>User from Cookie:{appUser}</p>
    </div>
  )
}
export default Profile

export async function getServerSideProps(context: any) {
  const { cookies } = context.req
  console.log(cookies)

  return {
    props: {
      initialAppUser: "Test"
    }
  }
}
