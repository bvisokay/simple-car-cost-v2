import React from "react"
import { useImmerReducer } from "use-immer"
import { BtnWide, SectionVeryNarrow, FormControl, SectionTitle } from "../styles/GlobalComponents"
import Link from "next/link"

// Should be a page guard if logged in you cannot visit?

// Initial State for Reducer
const initialState = {
  username: {
    value: "",
    hasErrors: false,
    message: ""
  },
  password: {
    value: "",
    hasErrors: false,
    message: ""
  },
  submitCount: 0,
  isSaving: false
}

// Reducer Function
function ourReducer(draft: any, action: any) {
  switch (action.type) {
    case "usernameImmediately":
      return
    case "passwordImmediately":
      return
    case "usernameAfterDelay":
      return
    case "passwordAfterDelay":
      return
    case "submitForm":
      alert("form submitted")
      return
    case "saveRequestStarted":
      draft.isSaving = true
      return
    case "saveRequestFinished":
      draft.isSaving = false
      return
    case "clearFields":
      console.log("clearFields ran")
      draft.username.value = ""
      draft.password.value = ""
      return
  }
}

// 2 fields, username password
// client side validation
// server side validation
// see if the username does not exist
// redirect to the profile page on successfuly login

const login: React.FC = () => {
  // useImmerReducer
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  // useEffect to watch sendCount to submit request
  // dont run when the page first loads
  // inside useEffect define and call async fucntion to /api/register
  // if response is success then redirect
  // ensure error handling

  function loginHandler(e: React.FormEvent) {
    e.preventDefault()
    // dispatches the submitForm action
  }

  return (
    <SectionVeryNarrow>
      <SectionTitle>Sign In</SectionTitle>

      <form onSubmit={loginHandler}>
        <FormControl>
          <label htmlFor="username">Username</label>
          <input type="text" value={state.username.value} onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} aria-label="username" autoComplete="off" placeholder="Username" />
          {state.username.hasErrors && <div className="liveValidateMessage">{state.username.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="password">Password</label>
          <input type="text" value={state.password.value} onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} aria-label="password" autoComplete="off" placeholder="Password" />
          {state.password.hasErrors && <div className="liveValidateMessage">{state.password.message}</div>}
        </FormControl>
        <BtnWide color={"var(--green)"} disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Log In"}
        </BtnWide>
      </form>
      <p>
        Don't have an account? <Link href="/register">Sign up</Link>
      </p>
    </SectionVeryNarrow>
  )
}

export default login
