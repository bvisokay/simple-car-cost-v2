import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import { BtnWide, SectionVeryNarrow, FormControl, SectionTitle } from "../styles/GlobalComponents"
import Link from "next/link"

// Should be a page guard if logged in you cannot visit?

// 3 fields, username, email, password
// client side validation
// server side validation
// see if the username or email is already taken
// store user in DB if necessary
// redirect to the profile page on successfuly login

const register: React.FC = () => {
  // Initial State for Reducer
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  }

  // Reducer Function
  function ourReducer(draft: any, action: any) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "Username cannot exceed 30 characters."
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Username can only contain letters and numbers."
        }
        return
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be at least 3 characters."
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        return
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "That username is already taken."
        } else {
          draft.username.isUnique = true
        }
        return
      case "emailImmediately":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "That email is already being used."
        } else {
          draft.email.isUnique = true
        }
        return
      case "passwordImmediately":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot exceed 50 characters"
        }
        return
      case "passwordAfterDelay":
        if (draft.password.value.length < 8) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be at least 8 characters."
        }
        return
      case "submitForm":
        console.log("SubmitForm ran")
        if (!draft.username.hasErrors /* && draft.username.isUnique */ && !draft.email.hasErrors /* && draft.email.isUnique */ && !draft.password.hasErrors) {
          draft.submitCount++
        } else {
          console.log("SubmitForm conditionals failed")
        }
        return
    }
  }

  // useImmerReducer
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  // username validation after delay
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  // email validation after delay
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  // password validation after delay
  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  // useEffect to POST /doesUsernameExist

  // useEffect to POST /doesEmailExist

  // useEffect to watch sendCount to submit request
  // don't run when the page first loads
  // inside useEffect define and call async function to /api/register
  // if response is success then redirect
  // ensure error handling
  useEffect(() => {
    if (state.submitCount) {
      console.log("state.submitCount Triggered useEffect")
      const controller = new AbortController()
      const signal = controller.signal
      async function fetchResults() {
        try {
          const response = await fetch("/api/register", {
            signal,
            method: "POST",
            body: JSON.stringify({
              username: state.username.value,
              email: state.email.value,
              password: state.password.value
            }),
            headers: {
              "Content-Type": "application/json"
            }
          })
          const data = await response.json()
          console.log(`data from endpoint: ${data}`)
          // update global state with login dispatch action
          // update gloabl state with flash Message welcome
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchResults()
      return () => controller.abort()
    }
  }, [state.submitCount])

  function handleSubmit(e: React.FormEvent) {
    console.log("HandleSubmit ran")
    e.preventDefault()
    // dispatches the submitForm action
    dispatch({ type: "usernameImmediately", value: state.username.value })
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true })
    dispatch({ type: "emailImmediately", value: state.email.value })
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
    dispatch({ type: "passwordImmediately", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <SectionVeryNarrow>
      <SectionTitle>register for a free account</SectionTitle>

      <form onSubmit={handleSubmit}>
        <FormControl>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={state.username.value} onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} aria-label="username" autoComplete="off" placeholder="Pick a username" />
          {state.username.hasErrors && <div className="liveValidateMessage">{state.username.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" value={state.email.value} onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} aria-label="email" autoComplete="off" placeholder="you@example.com" />
          {state.email.hasErrors && <div className="liveValidateMessage">{state.email.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="password">Password</label>
          <input type="text" name="password" value={state.password.value} onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} aria-label="password" autoComplete="off" placeholder="Create a password" />
          {state.password.hasErrors && <div className="liveValidateMessage">{state.password.message}</div>}
        </FormControl>
        <BtnWide color={"var(--green)"}>Sign Up</BtnWide>
      </form>
      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </SectionVeryNarrow>
  )
}

export default register
