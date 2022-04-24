import { useContext } from "react"
import { GlobalStateContext } from "../store/GlobalContext"

const landing = () => {
  const appState = useContext(GlobalStateContext)

  return (
    <div>
      <br />
      <h2>Hello, {appState.user.username}</h2>
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
export default landing
