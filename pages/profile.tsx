import { verify } from "jsonwebtoken"
import { useContext } from "react"
import { GlobalStateContext } from "../store/GlobalContext"

const Profile = (props: any) => {
  const appState = useContext(GlobalStateContext)

  return (
    <div>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{appState.loggedIn ? `LoggedIn from Context: ${appState.loggedIn}` : "false"}</p>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{appState.user.username ? `User from Context: ${appState.user.username.charAt(0).toUpperCase() + appState.user.username.slice(1)}` : "n/a"}</p>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{props.user ? `User from GSSP: ${props.user.charAt(0).toUpperCase() + props.user.slice(1)}` : "n/a"}</p>
    </div>
  )
}
export default Profile

export async function getServerSideProps(context: any) {
  const { cookies } = context.req
  const jwt = cookies.SimpleCarCostToken
  let user: any = ""
  if (jwt === undefined) {
    user = ""
  }
  try {
    const jwtPayload: any = verify(jwt, process.env.JWTSECRET!)
    if (jwtPayload) {
      user = jwtPayload.username
    }
  } catch (e) {
    user = ""
  }

  return {
    props: {
      user
    }
  }
}
