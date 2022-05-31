import { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { useRouter } from "next/router"
import { getSession } from "next-auth/client"
import { GlobalDispatchContext } from "../store/GlobalContext"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import User from "../models/User"
import { BtnWide, SectionVeryNarrow, FormControl, SectionTitle } from "../styles/GlobalComponents"

const ChangeSettings = (props: any) => {
  console.log(props)
  const appDispatch = useContext(GlobalDispatchContext)
  const router = useRouter()

  type SettingsActionTypes = { type: "annualMilesChecks"; value: string } | { type: "usefulMilesChecks"; value: string } | { type: "sameCheck" } | { type: "submitForm"; value?: string } | { type: "clearFields" }

  const initialState = {
    annualMiles: {
      value: props.data.annual_miles,
      hasErrors: false,
      message: ""
    },
    usefulMiles: {
      value: props.data.useful_miles,
      hasErrors: false,
      message: ""
    },
    showErrors: false,
    same: true,
    submitCount: 0
  }

  const [state, dispatch] = useImmerReducer(settingsReducer, initialState)

  function settingsReducer(draft: typeof initialState, action: SettingsActionTypes) {
    switch (action.type) {
      case "annualMilesChecks":
        draft.annualMiles.hasErrors = false
        draft.annualMiles.value = action.value
        if (draft.annualMiles.value === "") {
          draft.annualMiles.hasErrors = true
          draft.annualMiles.message = "Enter Annual Miles"
        }
        if (draft.annualMiles.value > 200000 || draft.annualMiles.value < 1200) {
          draft.annualMiles.hasErrors = true
          draft.annualMiles.message = "Invalid Annual Miles"
        }
        return
      case "usefulMilesChecks":
        draft.usefulMiles.hasErrors = false
        draft.usefulMiles.value = action.value
        if (draft.usefulMiles.value === "") {
          draft.usefulMiles.hasErrors = true
          draft.usefulMiles.message = "Enter a value for useful miles"
        }
        if (draft.usefulMiles.value > 500000 || draft.usefulMiles.value < 12000) {
          draft.usefulMiles.hasErrors = true
          draft.usefulMiles.message = "Invalid useful miles"
        }
        return
      case "sameCheck":
        draft.same = false
        if (draft.usefulMiles.value === props.data.useful_miles && draft.annualMiles.value === props.data.annual_miles) {
          draft.same = true
          appDispatch({ type: "flashMessage", value: "Nothing to update at this time" })
        }
        return
      case "submitForm":
        //console.log("SubmitForm ran")
        if (!draft.usefulMiles.hasErrors && !draft.annualMiles.hasErrors && draft.same !== true) {
          draft.showErrors = false
          draft.submitCount++
        } else {
          draft.showErrors = true
          console.log(`SubmitForm conditionals failed: {
              draft.usefulMiles.hasErrors: ${draft.usefulMiles.hasErrors}
              draft.annualMiles.hasErrors: ${draft.annualMiles.hasErrors}
            }`)
        }
        return
      case "clearFields":
        draft.usefulMiles.value = ""
        draft.annualMiles.value = ""
        return
    }
  }

  // useEffect to watch sendCount to attempt update only after validation passes
  // don't run when the page first loads
  useEffect(() => {
    if (state.submitCount) {
      const controller = new AbortController()
      const signal = controller.signal
      async function fetchResults() {
        try {
          //
          //
          const response = await fetch("/api/update-settings", {
            method: "PATCH",
            signal,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              annualMiles: state.annualMiles.value,
              usefulMiles: state.usefulMiles.value
            })
          })

          const data = await response.json()

          if (data.error) {
            appDispatch({ type: "flashMessage", value: data.error })
            console.warn(`from client: ${data.error}`)
            return
          }

          if (data.message === "success") {
            console.log(data)
            appDispatch({ type: "flashMessage", value: "Settings updated" })
            router.push("/dashboard")
          }

          //
        } catch (err: any) {
          if (err.error) {
            appDispatch({ type: "flashMessage", value: "Settings are not able to be updated at this time." })
            console.warn("err", err)
          } else {
            console.warn("err", err)
            appDispatch({ type: "flashMessage", value: "Could not update settings" })
          }

          // clear the form
          //dispatch({ type: "clearFields" })
        }
      }
      fetchResults()
      return () => controller.abort()
    } // end if
  }, [state.submitCount])

  async function updateSettingsSubmitHandler(e: React.FormEvent) {
    e.preventDefault()
    //check for validation errors
    dispatch({ type: "annualMilesChecks", value: state.annualMiles.value })
    dispatch({ type: "usefulMilesChecks", value: state.usefulMiles.value })
    dispatch({ type: "sameCheck" })
    dispatch({ type: "submitForm" })
  }

  return (
    <SectionVeryNarrow>
      <SectionTitle>Update Settings</SectionTitle>
      <p>Caution: Updated settings will apply to all existing cars in your list.</p>

      <form onSubmit={updateSettingsSubmitHandler}>
        <FormControl>
          <label htmlFor="annualMiles">Annual Driving (Miles)</label>
          <input type="number" value={state.annualMiles.value} onChange={e => dispatch({ type: "annualMilesChecks", value: e.target.value })} aria-label="annualMiles" autoComplete="off" placeholder="Default: 15000" autoFocus />
          {state.showErrors && state.annualMiles.hasErrors && <div className="liveValidateMessage">{state.annualMiles.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="usefulMiles">Expected Useful Life (Miles)</label>
          <input type="number" value={state.usefulMiles.value} onChange={e => dispatch({ type: "usefulMilesChecks", value: e.target.value })} aria-label="usefulMiles" autoComplete="off" placeholder="Default: 150000" />
          {state.showErrors && state.usefulMiles.hasErrors && <div className="liveValidateMessage">{state.usefulMiles.message}</div>}
        </FormControl>
        <BtnWide color={"var(--green)"}>Update</BtnWide>
      </form>
    </SectionVeryNarrow>
  )
}

export default ChangeSettings

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const username: string | undefined | null = session!.user!.name

  const results = await User.getSettings(username)

  //console.log(results)

  const data = {
    useful_miles: results!.data!.result.useful_miles,
    annual_miles: results!.data!.result.monthly_miles * 12
  }

  return {
    props: {
      data
    }
  }
}
