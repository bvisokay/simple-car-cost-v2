import { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Link from "next/link"
import { useRouter } from "next/router"
import { signIn } from "next-auth/client"
import { GlobalDispatchContext } from "../store/GlobalContext"

import { BtnWide, SectionVeryNarrow, FormControl, SectionTitle } from "../styles/GlobalComponents"

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
  const router = useRouter()

  type LoginActionTypes = { type: "usernameChecks"; value: string } | { type: "passwordChecks"; value: string } | { type: "submitForm"; value?: string }

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
    showErrors: false,
    submitCount: 0
  }

  const [state, dispatch] = useImmerReducer(loginReducer, initialState)

  function loginReducer(draft: typeof initialState, action: LoginActionTypes) {
    switch (action.type) {
      case "usernameChecks":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value === "") {
          draft.username.hasErrors = true
          draft.username.message = "Enter a username"
        }
        if (draft.username.value.length > 30 || draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Invalid username"
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Invalid username"
        }
        return
      case "passwordChecks":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value === "") {
          draft.password.hasErrors = true
          draft.password.message = "Enter a password"
        }
        if (draft.password.value.length > 50 || draft.password.value.length < 8) {
          draft.password.hasErrors = true
          draft.password.message = "Invalid password"
        }
        return
      case "submitForm":
        //console.log("SubmitForm ran")
        if (!draft.username.hasErrors && !draft.password.hasErrors) {
          draft.showErrors = false
          draft.submitCount++
        } else {
          draft.showErrors = true
          console.log(`SubmitForm conditionals failed: {
              draft.username.hasErrors: ${draft.username.hasErrors}
              draft.password.hasErrors: ${draft.password.hasErrors}
            }`)
        }
        return
    }
  }

  // useEffect to watch sendCount to attempt signIn only after validation passes
  // don't run when the page first loads
  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          //
          //
          const result = await signIn("credentials", {
            redirect: false,
            username: state.username.value?.toLowerCase(),
            password: state.password.value
          })

          console.log("result froms signIn", result)
          // no user found or bad username/password
          // what if we send non-alphanumeric
          if (result!.error) {
            appDispatch({ type: "flashMessage", value: result!.error })
            return
          }
          // push to new page
          router.replace("/dashboard")
          // show message to the user
          appDispatch({ type: "flashMessage", value: "Welcome Back" })

          //
        } catch (err) {
          console.log("err", err)
        }
      }
      fetchResults()
    } // end if
  }, [state.submitCount])

  async function loginSubmitHandler(e: React.FormEvent) {
    e.preventDefault()
    //check for validation errors
    dispatch({ type: "usernameChecks", value: state.username.value })
    dispatch({ type: "passwordChecks", value: state.password.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <SectionVeryNarrow>
      <SectionTitle>Sign In</SectionTitle>

      <form onSubmit={loginSubmitHandler}>
        <FormControl>
          <label htmlFor="username">Username</label>
          <input type="text" value={state.username.value} onChange={e => dispatch({ type: "usernameChecks", value: e.target.value })} aria-label="username" autoComplete="off" placeholder="Username" autoFocus />
          {state.showErrors && state.username.hasErrors && <div className="liveValidateMessage">{state.username.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="password">Password</label>
          <input type="password" value={state.password.value} onChange={e => dispatch({ type: "passwordChecks", value: e.target.value })} aria-label="password" autoComplete="off" placeholder="Password" />
          {state.showErrors && state.password.hasErrors && <div className="liveValidateMessage">{state.password.message}</div>}
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
