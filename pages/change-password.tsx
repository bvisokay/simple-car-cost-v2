import { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { useRouter } from "next/router"
import { runServerSidePageGuard } from "../lib/auth"
import { GlobalDispatchContext } from "../store/GlobalContext"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

//styles
import { BtnWide, SectionVeryNarrow, FormControl } from "../styles/GlobalComponents"

// types
import { ResponseType } from "../lib/types"

const ChangePassword: React.FC = () => {
  const appDispatch = useContext(GlobalDispatchContext)
  const router = useRouter()

  type LoginActionTypes = { type: "oldPasswordChecks"; value: string } | { type: "newPasswordChecks"; value: string } | { type: "sameCheck" } | { type: "submitForm"; value?: string } | { type: "clearFields" }

  const initialState = {
    oldPassword: {
      value: "",
      hasErrors: false,
      message: ""
    },
    newPassword: {
      value: "",
      hasErrors: false,
      message: ""
    },
    showErrors: false,
    same: true,
    submitCount: 0
  }

  const [state, dispatch] = useImmerReducer(loginReducer, initialState)

  function loginReducer(draft: typeof initialState, action: LoginActionTypes) {
    switch (action.type) {
      case "oldPasswordChecks":
        draft.oldPassword.hasErrors = false
        draft.oldPassword.value = action.value
        if (draft.oldPassword.value === "") {
          draft.oldPassword.hasErrors = true
          draft.oldPassword.message = "Enter Old Password"
        }
        if (draft.oldPassword.value.length > 50 || draft.oldPassword.value.length < 8) {
          draft.oldPassword.hasErrors = true
          draft.oldPassword.message = "Invalid Old Password"
        }
        return
      case "newPasswordChecks":
        draft.newPassword.hasErrors = false
        draft.newPassword.value = action.value
        if (draft.newPassword.value === "") {
          draft.newPassword.hasErrors = true
          draft.newPassword.message = "Enter New Password"
        }
        if (draft.newPassword.value.length > 50 || draft.newPassword.value.length < 8) {
          draft.newPassword.hasErrors = true
          draft.newPassword.message = "Invalid New Password"
        }
        return
      case "sameCheck":
        draft.same = false
        if (draft.oldPassword.value === draft.newPassword.value) {
          draft.same = true
          draft.newPassword.hasErrors = true
          draft.newPassword.message = "New and old password cannot match"
        }
        return
      case "submitForm":
        //console.log("SubmitForm ran")
        if (!draft.oldPassword.hasErrors && !draft.newPassword.hasErrors && draft.same !== true) {
          draft.showErrors = false
          draft.submitCount++
        } else {
          draft.showErrors = true
        }
        return
      case "clearFields":
        draft.oldPassword.value = ""
        draft.newPassword.value = ""
        return
    }
  }

  async function fetchResults(signal: AbortSignal) {
    try {
      const response = await fetch("/api/change-password", {
        signal: signal,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          oldPW: state.oldPassword.value,
          newPW: state.newPassword.value
        })
      })

      const returnedData = (await response.json()) as ResponseType
      const { message, errors }: ResponseType = returnedData

      if (errors) {
        appDispatch({ type: "flashMessage", value: errors })
        throw { message: "error", errors: errors }
      }

      if (message === "success") {
        //console.log(returnedData)
        appDispatch({ type: "flashMessage", value: "Password updated" })
        // https://nextjs.org/docs/api-reference/next/router
        void router.push("/dashboard")
      }

      //
    } catch (err: unknown) {
      appDispatch({ type: "flashMessage", value: "Password is not able to be updated at this time." })
      // clear the form
      dispatch({ type: "clearFields" })
      throw { message: "error", errors: err }
    }
  }

  // useEffect to watch sendCount to attempt signIn only after validation passes
  // don't run when the page first loads
  useEffect(() => {
    if (state.submitCount) {
      const controller = new AbortController()
      const signal = controller.signal
      void fetchResults(signal)
      return () => controller.abort()
    } // end if
  }, [state.submitCount])

  function updatePasswordSubmitHandler(e: React.FormEvent) {
    e.preventDefault()
    //check for validation errors
    dispatch({ type: "oldPasswordChecks", value: state.oldPassword.value })
    dispatch({ type: "newPasswordChecks", value: state.newPassword.value })
    dispatch({ type: "sameCheck" })
    dispatch({ type: "submitForm" })
  }

  return (
    <SectionVeryNarrow>
      <h2>Update Password</h2>

      <form onSubmit={updatePasswordSubmitHandler}>
        <FormControl>
          <label htmlFor="oldPassword">Old Password</label>
          <input type="password" value={state.oldPassword.value} onChange={e => dispatch({ type: "oldPasswordChecks", value: e.target.value })} aria-label="oldPassword" autoComplete="off" placeholder="Old Password" autoFocus />
          {state.showErrors && state.oldPassword.hasErrors && <div className="liveValidateMessage">{state.oldPassword.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="newPassword">New Password</label>
          <input type="password" value={state.newPassword.value} onChange={e => dispatch({ type: "newPasswordChecks", value: e.target.value })} aria-label="newPassword" autoComplete="off" placeholder="New Password" />
          {state.showErrors && state.newPassword.hasErrors && <div className="liveValidateMessage">{state.newPassword.message}</div>}
        </FormControl>
        <BtnWide bgColor={"var(--green)"} color={"var(--green)"}>
          Update
        </BtnWide>
      </form>
    </SectionVeryNarrow>
  )
}

export default ChangePassword

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await runServerSidePageGuard(context)
  return session
}
