import { GetServerSideProps, GetServerSidePropsContext } from "next"
import Link from "next/link"
import React, { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { GlobalDispatchContext } from "../store/GlobalContext"
import { useRouter } from "next/router"
import { signIn } from "next-auth/client"
import { getSession } from "next-auth/client"
import { BtnWide, SectionVeryNarrow, FormControl } from "../styles/GlobalComponents"

type RegisterActionTypes = { type: "usernameImmediately"; value: string } | { type: "usernameAfterDelay"; value?: string; noRequest?: boolean } | { type: "usernameUniqueResults"; value: string } | { type: "emailImmediately"; value: string } | { type: "emailAfterDelay"; value?: string; noRequest?: boolean } | { type: "emailUniqueResults"; value: string } | { type: "passwordImmediately"; value: string } | { type: "passwordAfterDelay"; value?: string } | { type: "submitForm" }

interface InitialStateTypes {
  username: {
    value: string
    hasErrors: boolean
    message: string
    isUnique: boolean
    checkCount: number
  }
  email: {
    value: string
    hasErrors: boolean
    message: string
    isUnique: boolean
    checkCount: number
  }
  password: {
    value: string
    hasErrors: boolean
    message: string
  }
  submitCount: number
}

const Register: React.FC = () => {
  // Assignments
  const appDispatch = useContext(GlobalDispatchContext)
  const router = useRouter()

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
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  // Reducer Function
  function ourReducer(draft: InitialStateTypes, action: RegisterActionTypes) {
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
        //console.log("usernameAfterDelay ran")
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be at least 3 characters."
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        return
      case "usernameUniqueResults":
        if (!action.value) {
          draft.username.hasErrors = false
          draft.username.isUnique = true
        } else {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "That username is already taken."
        }
        return
      case "emailImmediately":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "emailAfterDelay":
        //console.log("emailAfterDelay ran")
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      case "emailUniqueResults":
        //console.log("emailUniqueResults ran")
        if (!action.value) {
          draft.email.hasErrors = false
          draft.email.isUnique = true
        } else {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "That email is already registered."
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
        //console.log("SubmitForm ran")
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++
        } else {
          console.table(`SubmitForm conditionals failed: {
            draft.username.hasErrors: ${draft.username.hasErrors}
            draft.username.isUnique: ${draft.username.isUnique}
            draft.email.hasErrors: ${draft.email.hasErrors}
            draft.email.isUnique: ${draft.email.isUnique}
            draft.password.hasErrors: ${draft.password.hasErrors}
          }`)
        }
        return
    }
  }

  // username validation after delay
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

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

  async function fetchDoesUsernameExistResults(signal: AbortSignal) {
    try {
      const response = await fetch("/api/doesUserValueExist", {
        signal,
        method: "POST",
        body: JSON.stringify({ key: "username", value: state.username.value }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      //console.log(`data from usernameUnique api: ${data.message}`)
      dispatch({ type: "usernameUniqueResults", value: data.message })
    } catch (e) {
      console.log(`There was a problem or the request was cancelled: ${e}`)
    }
  }

  useEffect(() => {
    if (state.username.checkCount) {
      const controller = new AbortController()
      const signal = controller.signal
      void fetchDoesUsernameExistResults(signal)
      return () => controller.abort()
    }
  }, [state.username.checkCount])

  async function fetchDoesEmailExistResults(signal: AbortSignal) {
    try {
      const response = await fetch("/api/doesUserValueExist", {
        signal: signal,
        method: "POST",
        body: JSON.stringify({ key: "email", value: state.email.value }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      //console.log(`data from emailUnique api: ${data.message}`)
      dispatch({ type: "emailUniqueResults", value: data.message })
    } catch (e) {
      console.log(`There was a problem or the request was cancelled: ${e}`)
    }
  }

  useEffect(() => {
    // if check greater than one
    if (state.email.checkCount) {
      const controller = new AbortController()
      const signal = controller.signal
      void fetchDoesEmailExistResults(signal)
      return () => controller.abort()
    }
  }, [state.email.checkCount])

  async function fetchRegisterResults(signal: AbortSignal) {
    try {
      const response = await fetch("/api/auth/register", {
        signal: signal,
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
      if (data.message != "success") {
        appDispatch({ type: "flashMessage", value: "Could not register" })
        //appDispatch({ type: "flashMessage", value: [data.errors] })
        console.warn(data.errors)
        throw { message: "Could not register", errors: [data.errors] }
      }
      // now sign the user in - note: signIn will always resolve even with error
      const result = await signIn("credentials", { redirect: false, username: state.username.value, password: state.password.value })
      if (result!.error) {
        appDispatch({ type: "flashMessage", value: "Problem with registration" })
        console.warn(`There was a problem signing in: ${result!.error}`)
        throw { message: "Could not sign in", errors: result!.error }
      }
      await router.replace("/dashboard")
      appDispatch({ type: "flashMessage", value: "Welcome!" })
    } catch (err) {
      //appDispatch({ type: "flashMessage", value: `${err?.errors}` })
      appDispatch({ type: "flashMessage", value: `something went wrong` })
      console.log(`There was a problem: ${err}`)
      return { errors: err }
    }
  }

  useEffect(() => {
    if (state.submitCount) {
      const controller = new AbortController()
      const signal = controller.signal
      void fetchRegisterResults(signal)
      return () => controller.abort()
    }
  }, [state.submitCount])

  function handleSubmit(e: React.FormEvent) {
    //console.log("HandleSubmit ran")
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

  // jsx
  return (
    <SectionVeryNarrow>
      <h2>Register for a Free Account</h2>
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
          <input type="password" name="password" value={state.password.value} onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} aria-label="password" autoComplete="off" placeholder="Create a password" />
          {state.password.hasErrors && <div className="liveValidateMessage">{state.password.message}</div>}
        </FormControl>
        <BtnWide bgColor={"var(--teal)"}>Sign Up</BtnWide>
      </form>
      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </SectionVeryNarrow>
  )
}

export default Register

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
