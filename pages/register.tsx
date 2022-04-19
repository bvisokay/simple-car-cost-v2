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
  email: {
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
    case "emailImmediately":
      return
    case "passwordImmediately":
      return
    case "usernameAfterDelay":
      return
    case "emailAfterDelay":
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
      draft.email.value = ""
      draft.password.value = ""
      return
  }
}

// 3 fields, username, email, password
// client side validation
// server side validation
// see if the username or email is already taken
// store user in DB if necessary
// redirect to the profile page on successfuly login

const register: React.FC = () => {
  // useImmerReducer
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  // useEffect to watch sendCount to submit request
  // dont run when the page first loads
  // inside useEffect define and call async fucntion to /api/register
  // if response is success then redirect
  // ensure error handling

  function newUserHandler(e: React.FormEvent) {
    e.preventDefault()
    // dispatches the submitForm action
  }

  return (
    <SectionVeryNarrow>
      <SectionTitle>register for a free account</SectionTitle>

      <form onSubmit={newUserHandler}>
        <FormControl>
          <label htmlFor="username">Username</label>
          <input type="text" value={state.username.value} onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} aria-label="username" autoComplete="off" placeholder="Pick a username" />
          {state.username.hasErrors && <div className="liveValidateMessage">{state.username.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="email">Email</label>
          <input type="text" value={state.email.value} onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} aria-label="email" autoComplete="off" placeholder="you@example.com" />
          {state.email.hasErrors && <div className="liveValidateMessage">{state.email.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="password">Password</label>
          <input type="text" value={state.password.value} onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} aria-label="password" autoComplete="off" placeholder="Create a password" />
          {state.password.hasErrors && <div className="liveValidateMessage">{state.password.message}</div>}
        </FormControl>
        <BtnWide color={"var(--green)"} disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Sign Up"}
        </BtnWide>
      </form>
      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </SectionVeryNarrow>
  )
}

export default register
