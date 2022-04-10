import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import Link from "next/link"
//import { CSSTransition } from "react-transition-group"

//comps
import CarCard from "./CarCard"
import { SectionTitle, LeadMuted, FormControl, BtnWide } from "../styles/GlobalComponents"

const initialState = {
  testDriveItems: [],
  description: {
    value: "",
    hasErrors: false,
    message: ""
  },
  price: {
    value: "",
    hasErrors: false,
    message: ""
  },
  miles: {
    value: "",
    hasErrors: false,
    message: ""
  },
  link: {
    value: "",
    hasErrors: false,
    message: ""
  },
  submitCount: 0,
  isSaving: false
}

function ourReducer(draft: any, action: any) {
  switch (action.type) {
    case "addNewValidatedItem":
      draft.testDriveItems.push(action.value)
      return
    case "descriptionImmediately":
      draft.description.hasErrors = false
      draft.description.value = action.value
      if (draft.description.value == "") {
        draft.description.hasErrors = true
        draft.description.message = "Please enter a description"
      }
      if (draft.description.value.length > 60) {
        draft.description.hasErrors = true
        draft.description.message = "The description cannot exceed 60 characters."
      }
      return
    case "priceImmediately":
      draft.price.hasErrors = false
      draft.price.value = action.value
      if (draft.price.value == "") {
        draft.price.hasErrors = true
        draft.price.message = "Please enter a price"
      }
      if (draft.price.value > 250000) {
        draft.price.hasErrors = true
        draft.price.message = "Settle down there partner, enter a price under $250,000"
      }
      if (parseFloat(draft.price.value) < 1) {
        draft.price.hasErrors = true
        draft.price.message = "The price cannot be less than $1"
      }
      return
    case "milesImmediately":
      draft.miles.hasErrors = false
      draft.miles.value = action.value
      if (draft.miles.value == "") {
        draft.miles.hasErrors = true
        draft.miles.message = "Please enter a value for miles"
      }
      if (draft.miles.value > 300000) {
        draft.miles.hasErrors = true
        draft.miles.message = "This thing is getting up there! Please enter lower value for the miles"
      }

      return
    case "linkImmediately":
      draft.link.hasErrors = false
      draft.link.value = action.value
      return
    case "submitForm":
      if (draft.description.value.trim() == "") {
        draft.description.hasErrors = true
        draft.description.message = "You must enter a description."
      }
      if (draft.price.value == "") {
        draft.price.hasErrors = true
        draft.price.message = "You must enter a price."
      }
      if (draft.miles.value.trim() == "") {
        draft.miles.hasErrors = true
        draft.miles.message = "You must enter a value for the miles."
      }
      if (draft.miles.value < 1) {
        draft.miles.hasErrors = true
        draft.miles.message = "Mileage must be greater than 0."
      }
      // if no fields have an error then submit the form
      if (!draft.description.hasErrors && !draft.price.hasErrors && !draft.miles.hasErrors && !draft.link.hasErrors) {
        draft.submitCount++
      }
      return
    case "saveRequestStarted":
      draft.isSaving = true
      return
    case "saveRequestFinished":
      draft.isSaving = false
      return
    case "clearFields":
      draft.description.value = ""
      draft.price.value = ""
      draft.miles.value = ""
      draft.link.value = ""
      return
  }
}

// Retrieve Any Existing Items from local storage

// Store Any New Vehicles in local storage

// Delete All Button removes from local storage

// Can edit from local storage

const TestDrive = () => {
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  function newTestDriveCarHandler(e: React.FormEvent) {
    e.preventDefault()
    console.log("newTestDriveCarHandler")
    dispatch({ type: "submitForm" })
  }

  // useEffect to submitForm Request if no validation errors
  useEffect(() => {
    //don't run when the page first loads
    if (state.submitCount) {
      dispatch({ type: "saveRequestStarted" })
      //format new item to store and display
      const newTdItem = {
        description: state.description.value.toString(),
        price: parseInt(state.price.value),
        miles: parseInt(state.miles.value),
        link: state.link.value.toString(),
        RM: 36,
        CPRM: 398
      }

      console.log(newTdItem)
      dispatch({ type: "addNewValidatedItem", value: newTdItem })
      dispatch({ type: "clearFields" })
    }
  }, [state.submitCount])

  return (
    <>
      <SectionTitle color={"var(--secondary)"}>Take it for a test drive</SectionTitle>
      <p className="small">
        Assumed driving of 15,000 miles per year and useful life of 150,000 miles. <Link href="/register">Sign up</Link> for a free account to customize miles driven per year and useful life. Also gain access to sorting and the ability to access your listings across multiple devices.
      </p>
      <LeadMuted>Enter Vehicle Details</LeadMuted>

      <form onSubmit={newTestDriveCarHandler}>
        <FormControl>
          <label htmlFor="description">Description (Example: {new Date().getFullYear()} Jeep Wrangler)</label>
          <input
            id="description"
            type="text"
            autoComplete="off"
            name="description"
            value={state.description.value}
            aria-label="description"
            onChange={e => {
              dispatch({ type: "descriptionImmediately", value: e.target.value })
            }}
          />
          {/* <CSSTransition in={state.description.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="liveValidateMessage">{state.description.message}</div>
          </CSSTransition> */}
        </FormControl>
        <FormControl>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            autoComplete="off"
            name="price"
            value={state.price.value}
            aria-label="price"
            onChange={e => {
              dispatch({ type: "priceImmediately", value: e.target.value })
            }}
          />
          {/* <CSSTransition in={state.price.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="liveValidateMessage">{state.price.message}</div>
          </CSSTransition> */}
        </FormControl>
        <FormControl>
          <label htmlFor="miles">Miles</label>
          <input
            id="miles"
            type="number"
            autoComplete="off"
            name="miles"
            value={state.miles.value}
            aria-label="miles"
            onChange={e => {
              dispatch({ type: "milesImmediately", value: e.target.value })
            }}
          />
          {/*  <CSSTransition in={state.miles.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="liveValidateMessage">{state.miles.message}</div>
          </CSSTransition> */}
        </FormControl>
        <FormControl>
          <label htmlFor="link">Link</label>
          <input
            id="link"
            type="text"
            autoComplete="off"
            name="miles"
            value={state.link.value}
            aria-label="miles"
            onChange={e => {
              dispatch({ type: "linkImmediately", value: e.target.value })
            }}
          />
          {/* <CSSTransition in={state.link.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="liveValidateMessage">{state.link.message}</div>
          </CSSTransition> */}
        </FormControl>
        <BtnWide>Calculate</BtnWide>
      </form>

      {state.testDriveItems.length >= 1 && (
        <>
          <SectionTitle color={"var(--secondary)"}>Your List</SectionTitle>
          {state.testDriveItems.map((item: any, index) => {
            return <CarCard key={index} description={item.description} price={item.price} miles={item.miles} link={item.link} rem_months={item.RM} cprm={item.CPRM} />
          })}
        </>
      )}
    </>
  )
}
export default TestDrive
