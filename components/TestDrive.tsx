import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import Link from "next/link"
import styled from "styled-components"

//comps
import CarCard from "./CarCard"
import { Section, SectionTitle, FormControl, BtnWide } from "../styles/GlobalComponents"

const TestDriveListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
`

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
    case "handleExistingItems":
      draft.testDriveItems = action.value
      return
    case "deleteExistingItem":
      /* update state to remove from UI */
      draft.testDriveItems = draft.testDriveItems.filter((x: any) => {
        if (x.uniqueId !== action.value) return x
      })
      /* remove from local storage */
      return
    case "addNewValidatedItem":
      draft.testDriveItems.push(action.value)
      localStorage.setItem("tdCars", JSON.stringify(draft.testDriveItems))
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
    case "removeAnyErrors":
      draft.description.hasErrors = false
      draft.price.hasErrors = false
      draft.miles.hasErrors = false
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
      if (draft.description.value.length > 60) {
        draft.description.hasErrors = true
        draft.description.message = "The description cannot exceed 60 characters."
      }
      if (draft.price.value == "") {
        draft.price.hasErrors = true
        draft.price.message = "You must enter a price."
      }
      if (draft.price.value > 250000) {
        draft.price.hasErrors = true
        draft.price.message = "You must enter a price."
      }
      if (parseFloat(draft.price.value) < 1) {
        draft.price.hasErrors = true
        draft.price.message = "The price cannot be less than $1"
      }
      if (draft.miles.value.trim() == "") {
        draft.miles.hasErrors = true
        draft.miles.message = "You must enter a value for the miles."
      }
      if (draft.miles.value < 1) {
        draft.miles.hasErrors = true
        draft.miles.message = "Mileage must be greater than 0."
      }
      if (draft.miles.value > 300000) {
        draft.miles.hasErrors = true
        draft.miles.message = "Enter a lower value for the miles"
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

const TestDrive: React.FC = () => {
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  async function newTestDriveCarHandler(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type: "submitForm" })
  }

  function deleteHandler(uniqueId: number) {
    // update local storage
    const tdCarsInStorage = JSON.parse(localStorage.getItem("tdCars") || "{}")
    const updatedTdCarsInStorage = tdCarsInStorage.filter((car: any) => {
      if (car.uniqueId !== uniqueId) return car
    })
    localStorage.setItem("tdCars", JSON.stringify(updatedTdCarsInStorage))
    // remove from UI
    dispatch({ type: "deleteExistingItem", value: uniqueId })
  }

  // load existing tdItems on page load
  useEffect(() => {
    if (localStorage.getItem("tdCars") !== null) {
      const existingTdItems = JSON.parse(localStorage.getItem("tdCars") || "{}")
      dispatch({ type: "handleExistingItems", value: existingTdItems })
    }
  }, [])

  // remove client-side-validation error after a few seconds
  useEffect(() => {
    if (state.description.hasErrors || state.price.hasErrors || state.miles.hasErrors) {
      const timer = setTimeout(() => {
        dispatch({ type: "removeAnyErrors" })
      }, 3000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [state.description.hasErrors, state.price.hasErrors, state.miles.hasErrors])

  // useEffect to submitForm Request if no validation errors
  useEffect(() => {
    // don't want this to run when the page first loads
    if (state.submitCount) {
      dispatch({ type: "saveRequestStarted" })
      //format new item to store and display
      const newUnvalidatedTdItem = {
        description: state.description.value.toString(),
        price: parseFloat(state.price.value),
        miles: parseFloat(state.miles.value),
        link: state.link.value.toString()
      }
      // need the async request in useEffect trick

      async function fetchNewValidatedTdItem(newUnvalidatedTdItem: any) {
        const response = await fetch("/api/create-td-car", {
          method: "POST",
          body: JSON.stringify(newUnvalidatedTdItem),
          headers: { "Content-Type": "application/json" }
        })
        const newValidatedTdItem: any = await response.json()
        console.log(newValidatedTdItem)
        dispatch({ type: "addNewValidatedItem", value: newValidatedTdItem })
        // Store Any New Vehicles in local storage as well
        dispatch({ type: "clearFields" })
      }
      fetchNewValidatedTdItem(newUnvalidatedTdItem)

      // need cleanup function in case page changed mid-request
    }
  }, [state.submitCount])

  return (
    <Section>
      <SectionTitle color={"var(--dark-gray)"}>Take it for a Spin - Enter Vehicle Details</SectionTitle>
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
          {state.description.hasErrors && <div className="liveValidateMessage">{state.description.message}</div>}
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
          {state.price.hasErrors && <div className="liveValidateMessage">{state.price.message}</div>}
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
          {state.miles.hasErrors && <div className="liveValidateMessage">{state.miles.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="link">Link (Paste URL here or leave blank)</label>
          <input
            id="link"
            type="text"
            autoComplete="off"
            name="link"
            value={state.link.value}
            aria-label="link"
            onChange={e => {
              dispatch({ type: "linkImmediately", value: e.target.value })
            }}
          />
          {state.link.hasErrors && <div className="liveValidateMessage">{state.link.message}</div>}
        </FormControl>
        <BtnWide>Calculate</BtnWide>
      </form>

      <p className="small">
        Assumed driving of 15,000 miles per year and useful life of 150,000 miles. <Link href="/register">Sign up</Link> for a free account to customize miles driven per year and useful life. Also gain access to sorting and the ability to access your listings across multiple devices.
      </p>

      {state.testDriveItems.length >= 1 && (
        <>
          <SectionTitle color={"var(--dark-gray)"}>Your List</SectionTitle>
          <TestDriveListGrid>
            {state.testDriveItems.map((item: any) => {
              return <CarCard key={item.uniqueId} item={item} deleteHandler={deleteHandler} />
            })}
          </TestDriveListGrid>
        </>
      )}
    </Section>
  )
}
export default TestDrive
