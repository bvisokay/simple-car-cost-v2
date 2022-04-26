import { useContext, useState } from "react"
import { BtnWide, SectionVeryNarrow, FormControl, SectionTitle } from "../styles/GlobalComponents"
import Link from "next/link"
import { GlobalDispatchContext } from "../store/GlobalContext"
import { useRouter } from "next/router"

// Should be a page guard if logged in you cannot visit?
// add to middleware function
// also don't want to be able to access if you are logged in

// 2 fields, username password
// client side validation
// server side validation
// see if the username does not exist
// redirect to the profile page on successfuly login

const Login: React.FC = () => {
  const appDispatch = useContext(GlobalDispatchContext)
  const [username, setUsername] = useState<string | undefined>("")
  const [password, setPassword] = useState<string | undefined>("")
  const router = useRouter()

  // useEffect to watch sendCount to submit request
  // dont run when the page first loads
  // inside useEffect define and call async fucntion to /api/register
  // if response is success then redirect
  // ensure error handling

  async function loginHandler(e: React.FormEvent) {
    e.preventDefault()
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      console.log(data)
      if (data.data) {
        appDispatch({ type: "login", value: data.data })
        // push to new page
        router.replace("/profile")
        appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
      } else {
        console.log("Incorrect username / password.")
        appDispatch({ type: "flashMessage", value: "Invalid username / password." })
      }
    } catch (e) {
      console.log("There was a problem.")
    }
  }

  return (
    <SectionVeryNarrow>
      <SectionTitle>Sign In</SectionTitle>

      <form onSubmit={loginHandler}>
        <FormControl>
          <label htmlFor="username">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} aria-label="username" autoComplete="off" placeholder="Username" autoFocus />
        </FormControl>
        <FormControl>
          <label htmlFor="password">Password</label>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} aria-label="password" autoComplete="off" placeholder="Password" />
        </FormControl>
        <BtnWide color={"var(--green)"}>Sign In</BtnWide>
      </form>
      <p>
        Don't have an account? <Link href="/register">Sign up</Link>
      </p>
    </SectionVeryNarrow>
  )
}

export default Login
