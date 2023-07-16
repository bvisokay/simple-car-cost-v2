import { GetServerSidePropsContext } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import { useRef, useState, useEffect, useContext } from "react"
import { GlobalDispatchContext } from "../store/GlobalContext"

//comps
import { Display, FormControl, SectionNarrow, BtnWide } from "../styles/GlobalComponents"
import { ResponseType } from "../lib/types"

type QuickImportPropTypes = {
  username: string
}

const QuickImport: React.FC<QuickImportPropTypes> = ({ username }) => {
  const appDispatch = useContext(GlobalDispatchContext)

  // simple useRef should work here
  const quickImportRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)

  // can send the username to send to backend as redundant check?
  // send Request to /api/import-single with string

  const sendRequest = async (carDetailsString: string, username: string, signal: AbortSignal) => {
    const payloadToSend = {
      carDetailsString,
      username
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/import-single`, {
        signal,
        method: "POST",
        body: JSON.stringify(payloadToSend),
        headers: {
          "Content-type": "application/json"
        }
      })
      const data = (await response.json()) as ResponseType
      setIsLoading(false)
      if (data && data.message && data.message !== "success" && quickImportRef && quickImportRef.current) {
        appDispatch({ type: "flashMessage", value: data.message ? data.message : "Could not add vehicle" })
        quickImportRef.current.focus()
      }
      // show success message and clear field on success
      if (data && data.message && data.message === "success" && quickImportRef && quickImportRef.current) {
        appDispatch({ type: "flashMessage", value: "Vehicle Added" })
        quickImportRef.current.value = ""
        quickImportRef.current.focus()
      }
    } catch (err) {
      appDispatch({ type: "flashMessage", value: "Could not add vehicle at this time" })
      // show error message and clear field on failure
    }
  }

  useEffect(() => {
    if (submitCount) {
      if (!quickImportRef.current || !quickImportRef.current.value) {
        appDispatch({ type: "flashMessage", value: "Please enter a valid value" })
        return
      }
      //define abort controller
      const controller = new AbortController()
      const signal = controller.signal
      //sendRequest
      void sendRequest(quickImportRef.current.value, username, signal)
        .then(() => {
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
      //handle Teardown
      return () => {
        controller.abort()
      }
    }
  }, [submitCount])

  function submitHandler() {
    if (quickImportRef && quickImportRef.current && !quickImportRef.current.value) {
      appDispatch({ type: "flashMessage", value: "Please enter a value" })
      return
    } else {
      setSubmitCount(prev => prev + 1)
    }
  }

  // do not need client side validation

  return (
    <SectionNarrow>
      <Display>Quick Import</Display>
      <FormControl>
        <input id="quickImport" type="text" ref={quickImportRef} autoComplete="off" aria-label="quick-import-field" placeholder="Description, price, miles, link" />
        <BtnWide disabled={isLoading} onClick={submitHandler}>
          Go
        </BtnWide>
      </FormControl>
    </SectionNarrow>
  )
}
export default QuickImport

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const username = session?.user?.name

  return {
    props: { username }
  }
}
