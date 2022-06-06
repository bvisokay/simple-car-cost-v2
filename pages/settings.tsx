import { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { useRouter } from "next/router"
import { getSession } from "next-auth/client"
import { GlobalDispatchContext } from "../store/GlobalContext"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import User from "../models/User"
import { BtnWide, SectionVeryNarrow, FormControl } from "../styles/GlobalComponents"
import styled from "styled-components"

const WarningBox = styled.div`
  border: 1px solid orange;
  border-radius: 8px;
  background-color: #fff3cd;
  padding: 0rem 1rem;
  margin: 1rem 0 1.5rem 0;

  p {
    padding: 0;
    color: #856404;
    font-size: 0.85rem;
  }
`

interface SettingsProps {
  data: {
    annual_miles: number | string
    useful_miles: number | string
  }
}

const ChangeSettings = (props: SettingsProps) => {
  console.log("props", props)
  const appDispatch = useContext(GlobalDispatchContext)
  const router = useRouter()

  type SettingsActionTypes = { type: "annualMilesChecks"; value: string | number } | { type: "usefulMilesChecks"; value: string | number } | { type: "sameCheck" } | { type: "submitForm"; value?: string } | { type: "clearFields" }

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
        if ((typeof draft.annualMiles.value === "number" && draft.annualMiles.value > 200000) || (typeof draft.annualMiles.value === "number" && draft.annualMiles.value < 1200)) {
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
        if ((typeof draft.usefulMiles.value === "number" && draft.usefulMiles.value > 500000) || (typeof draft.usefulMiles.value === "number" && draft.usefulMiles.value < 12000)) {
          draft.usefulMiles.hasErrors = true
          draft.usefulMiles.message = "Invalid useful miles"
        }
        return
      case "sameCheck":
        draft.same = false
        if (draft.annualMiles.value === props.data.annual_miles && draft.usefulMiles.value === props.data.useful_miles) {
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
          //console.warn(`SubmitForm conditionals failed`)
        }
        return
      case "clearFields":
        draft.usefulMiles.value = ""
        draft.annualMiles.value = ""
        return
    }
  }

  async function fetchSettingsResults(signal: AbortSignal) {
    try {
      const response = await fetch("/api/update-settings", {
        signal: signal,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          annualMiles: state.annualMiles.value,
          usefulMiles: state.usefulMiles.value
        })
      })

      const data = await response.json()

      if (data.message !== "success") {
        appDispatch({ type: "flashMessage", value: "Settings not udpated" })
        throw { message: "error" }
      }

      if (data.message === "success") {
        console.log(data)
        appDispatch({ type: "flashMessage", value: "Settings updated" })
        void router.push("/dashboard")
      }

      //
    } catch (err) {
      appDispatch({ type: "flashMessage", value: "Could not update settings" })
      throw { message: "error", errors: err }
      // clear the form?
      //dispatch({ type: "clearFields" })
    }
  }

  useEffect(() => {
    if (state.submitCount) {
      const controller = new AbortController()
      const signal = controller.signal
      void fetchSettingsResults(signal)
      return () => controller.abort()
    } // end if
  }, [state.submitCount])

  function updateSettingsSubmitHandler(e: React.FormEvent) {
    e.preventDefault()
    //check for validation errors
    dispatch({ type: "annualMilesChecks", value: state.annualMiles.value })
    dispatch({ type: "usefulMilesChecks", value: state.usefulMiles.value })
    dispatch({ type: "sameCheck" })
    dispatch({ type: "submitForm" })
  }

  return (
    <SectionVeryNarrow>
      {/* <SectionTitle>Update Settings</SectionTitle> */}
      <h2>Update Settings</h2>
      <WarningBox>
        <p>Caution: Updated settings will apply to all existing cars in your list.</p>
      </WarningBox>

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
        <BtnWide bgColor={"var(--green)"}>Save Updates</BtnWide>
      </form>
    </SectionVeryNarrow>
  )
}

export default ChangeSettings

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  console.log("gssp ran")
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const username: string | undefined | null = session.user?.name

  const results = await User.getSettings(username)

  let data = { useful_miles: "", annual_miles: "" }
  if (results.data?.result.useful_miles && results.data?.result.annual_miles) {
    data = {
      useful_miles: results.data.result.useful_miles,
      annual_miles: results.data.result.annual_miles
    }
  }

  return {
    props: {
      data
    }
  }
}
