import { useContext } from "react"
import { GlobalStateContext } from "../store/GlobalContext"
import { verify } from "jsonwebtoken"

const Landing = (props: any) => {
  const appState = useContext(GlobalStateContext)

  return (
    <div>
      <p style={{ textAlign: "right", fontSize: ".7rem" }}>{props.user ? `User: ${props.user.charAt(0).toUpperCase(0) + props.user.slice(1)}` : "n/a"}</p>
      <br />
      <h2>Welcome{appState.user && `, ${appState.user.username}`}</h2>
      <hr />
      <br />
      <div>This page route should be dynamic...scc.com/:username</div>
      <br />
      <div>Create different Lists...scc.com/:username/:listname/:ItemID</div>
      <br />
      <div>Create different Items...scc.com/:username/:itemId</div>
      <br />
      <br />
      <ul>
        Settings:
        <li>Update Miles and Useful Life</li>
        <li>Update Username</li>
        <li>Add tax rate?</li>
        <li>Add auto loan</li>
        <li>Update Password</li>
        <li>Export Data</li>
        <li>Delete Account</li>
      </ul>
    </div>
  )
}
export default Landing

export async function getServerSideProps(context: any) {
  const { cookies } = context.req
  const jwt = cookies.SimpleCarCostToken
  let user: any = null
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
