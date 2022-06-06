import { getSession } from "next-auth/client"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Wrapper, Section, FormControl, BtnWide } from "../../styles/GlobalComponents"
import React, { useContext, useEffect } from "react"
import User from "../../models/User"
import Link from "next/link"
import { useImmerReducer } from "use-immer"
import { GlobalDispatchContext } from "../../store/GlobalContext"
import styled from "styled-components"
import { useRouter } from "next/router"

/* description, price, miles, link */

const NavBack = styled.div`
  margin: 1rem auto 2rem auto;
  a {
    color: var(--primary);
  }
`

const EditItemPage = (props: any) => {
  //console.log(props)

  const router = useRouter()

  type EditItemActionTypes = { type: "changeCheck" } | { type: "descriptionCheck"; value: string } | { type: "priceCheck"; value: string } | { type: "milesCheck"; value: string } | { type: "linkCheck"; value: string } | { type: "submitForm"; value?: string } | { type: "clearFields"; value?: string }

  const appDispatch = useContext(GlobalDispatchContext)

  const initialState = {
    description: { value: props.description, hasErrors: false, message: "" },
    price: { value: props.price, hasErrors: false, message: "" },
    miles: { value: props.miles, hasErrors: false, message: "" },
    link: { value: props.link, hasErrors: false, message: "" },
    changeCheckPassed: false,
    submitCount: 0
  }

  //reducer
  function EditItemReducer(draft: typeof initialState, action: EditItemActionTypes) {
    switch (action.type) {
      case "changeCheck":
        //console.log("changeCheck ran")
        if (draft.description.value === props.description && draft.price.value === props.price && draft.miles.value === props.miles && draft.link.value === props.link) {
          draft.changeCheckPassed = false
          appDispatch({ type: "flashMessage", value: "The values must not be the same" })
        } else {
          draft.changeCheckPassed = true
        }
        return
      case "descriptionCheck":
        draft.description.hasErrors = false
        draft.description.value = action.value
        if (draft.description.value === "") {
          draft.description.hasErrors = true
          draft.description.message = "Enter a description"
        }
        if (draft.description.value.length >= 1 && draft.description.value.length <= 3) {
          draft.description.hasErrors = true
          draft.description.message = "Enter a better description"
        }
        if (draft.description.value.length > 100) {
          draft.description.hasErrors = true
          draft.description.message = "Enter a shorter description"
        }
        /* if (draft.description.value.length < 2) {
          draft.description.hasErrors = true
          draft.description.message = "Need a better description"
        } */
        return
      case "priceCheck":
        draft.price.hasErrors = false
        draft.price.value = action.value
        if (draft.price.value === "") {
          draft.price.hasErrors = true
          draft.price.message = "Enter a price"
        }
        if (parseInt(draft.price.value) < 1) {
          draft.price.hasErrors = true
          draft.price.message = "Enter a higher price"
        }
        if (parseInt(draft.price.value) > 200000) {
          draft.price.hasErrors = true
          draft.price.message = "Enter a lower price"
        }
        return
      case "milesCheck":
        draft.miles.hasErrors = false
        draft.miles.value = action.value
        if (draft.miles.value === "") {
          draft.miles.hasErrors = true
          draft.miles.message = "Enter a miles value"
        }
        if (parseInt(draft.miles.value) > 350000) {
          draft.miles.hasErrors = true
          draft.miles.message = "Enter a lower miles value"
        }
        if (parseInt(draft.miles.value) < 0) {
          draft.miles.hasErrors = true
          draft.miles.message = "Miles can not be negative"
        }
        return
      case "linkCheck":
        draft.link.hasErrors = false
        draft.link.value = action.value
        if (draft.link.value.length > 299) {
          draft.link.hasErrors = true
          draft.link.message = "Enter a shorter link"
        }
        return
      case "submitForm":
        if (!draft.description.hasErrors && !draft.price.hasErrors && !draft.miles.hasErrors && !draft.link.hasErrors && draft.changeCheckPassed === true) {
          draft.submitCount++
        } else {
          appDispatch({ type: "flashMessage", value: "Error Submitting Updates" })
        }
        return
      case "clearFields":
        draft.description.value = ""
        draft.price.value = ""
        draft.miles.value = ""
        draft.link.value = ""
        return
    }
  }

  const [state, dispatch] = useImmerReducer(EditItemReducer, initialState)

  async function sendRequest(signal: AbortSignal) {
    try {
      //appDispatch({ type: "flashMessage", value: "Sent Request to API" })
      const response = await fetch("/api/update-item", {
        signal: signal,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          carId: props._id,
          description: state.description.value,
          price: state.price.value,
          miles: state.miles.value,
          link: state.link.value
        })
      })
      const data = await response.json()
      if (data.error) {
        appDispatch({ type: "flashMessage", value: data.error })
        console.warn(`from client: ${data.error}`)
        return
      }
      if (data.message === "success") {
        appDispatch({ type: "flashMessage", value: "Car successfully updated" })
        await router.push("/list")
        return
      }
    } catch (err) {
      appDispatch({ type: "flashMessage", value: "Could not update car: Ref#: 111" })
      console.error(err)
    }
  }

  useEffect(() => {
    if (state.submitCount) {
      const controller = new AbortController()
      const signal = controller.signal
      void sendRequest(signal)
      return () => controller.abort()
    }
  }, [state.submitCount])

  const editItemHandler = (e: React.FormEvent) => {
    e.preventDefault()
    // run all the checks and submitForm
    dispatch({ type: "descriptionCheck", value: state.description.value })
    dispatch({ type: "priceCheck", value: state.price.value })
    dispatch({ type: "milesCheck", value: state.miles.value })
    dispatch({ type: "linkCheck", value: state.link.value })
    dispatch({ type: "changeCheck" })
    dispatch({ type: "submitForm" })
  }

  return (
    <Wrapper>
      <Section>
        <form onSubmit={editItemHandler}>
          <NavBack>
            <Link href="/list">&laquo; Back to list</Link>
          </NavBack>
          <h2>Edit Car</h2>
          {/* <p>{state.changeCheckPassed ? "Yes" : "No"}</p> */}

          <FormControl>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              autoComplete="off"
              name="description"
              value={state.description.value}
              aria-label="description"
              onChange={e => {
                dispatch({ type: "descriptionCheck", value: e.target.value })
              }}
              placeholder={`${new Date().getFullYear()} Jeep Wrangler`}
            />
            {state.description.hasErrors && <div className="liveValidateMessage">{state.description.message}</div>}
          </FormControl>
          <FormControl>
            <label htmlFor="price">Price</label>
            <input
              min={1}
              id="price"
              type="number"
              autoComplete="off"
              name="price"
              value={state.price.value}
              aria-label="price"
              onChange={e => {
                dispatch({ type: "priceCheck", value: e.target.value })
              }}
              placeholder="Enter a price"
            />
            {state.price.hasErrors && <div className="liveValidateMessage">{state.price.message}</div>}
          </FormControl>
          <FormControl>
            <label htmlFor="miles">Miles</label>
            <input
              min={0}
              id="miles"
              type="number"
              autoComplete="off"
              name="miles"
              value={state.miles.value}
              aria-label="miles"
              onChange={e => {
                dispatch({ type: "milesCheck", value: e.target.value })
              }}
              placeholder="Enter miles"
            />
            {state.miles.hasErrors && <div className="liveValidateMessage">{state.miles.message}</div>}
          </FormControl>
          <FormControl>
            <label htmlFor="link">Link</label>
            <input
              id="link"
              type="text"
              autoComplete="off"
              name="link"
              value={state.link.value}
              aria-label="link"
              onChange={e => {
                dispatch({ type: "linkCheck", value: e.target.value })
              }}
              placeholder="Paste URL here"
            />
            {state.link.hasErrors && <div className="liveValidateMessage">{state.link.message}</div>}
          </FormControl>
          <BtnWide bgColor={"var(--green)"}>Submit Changes</BtnWide>
        </form>
      </Section>
    </Wrapper>
  )
}
export default EditItemPage

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
  const username = session.user?.name?.toString()
  const carId = context.query.id
  const result: any = await User.doesUserMatchAuthor(username, carId)
  if (result.editableCar) {
    return {
      props: result.editableCar
    }
  } else {
    return {
      props: {}
    }
  }
  // need to not only make sure that the usr is logged in but the user is the author
}
