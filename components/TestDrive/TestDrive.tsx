import React, { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Link from "next/link"
import { GlobalDispatchContext } from "../../store/GlobalContext"

//styles
import styled from "styled-components"
import { FormControl, BtnWide } from "../../styles/GlobalComponents"
import { breakpoints } from "../../styles/breakpoints"

//comps
import TestDriveListItemCard from "../TestDriveListItemCard/TestDriveListItemCard"

//type
import { PrimaryCarFields, TestDriveCarType, NewTDResponseType } from "../../lib/types"

const TDSection = styled.div`
  margin: 5rem auto 2rem auto;
  border: var(--border-width) solid var(--primary);
  border-radius: var(--roundness);
  padding: 1rem;
  background-color: white;

  h2 {
    //border: 2px solid crimson;
    margin-bottom: 2rem;
    text-align: center;
  }
`

const TestDriveListGrid = styled.div`
  @media ${breakpoints.xs} {
    //background-color: aqua;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 8px;
    margin-top: 2rem;
  }
`

type TestDriveActionTypes = { type: "handleExistingItems"; value: TestDriveCarType[] } | { type: "deleteExistingItem"; value: number } | { type: "addNewValidatedItem"; value: TestDriveCarType } | { type: "descriptionImmediately"; value: string } | { type: "priceImmediately"; value: string | number } | { type: "milesImmediately"; value: string | number } | { type: "removeAnyErrors"; value?: string } | { type: "linkImmediately"; value: string } | { type: "submitForm"; value?: string } | { type: "saveRequestStarted"; value?: string } | { type: "saveRequestFinished"; value?: string } | { type: "clearFields"; value?: string }

const TestDrive: React.FC = () => {
  const appDispatch = useContext(GlobalDispatchContext)

  interface TestDriveInitialStateTypes {
    testDriveItems: TestDriveCarType[]
    description: {
      value: string
      hasErrors: boolean
      message: string
    }
    price: {
      value: string | number
      hasErrors: boolean
      message: string
    }
    miles: {
      value: string | number
      hasErrors: boolean
      message: string
    }
    link: {
      value: string
      hasErrors: boolean
      message: string
    }
    submitCount: number
    isSaving: boolean
  }

  const initialState = {
    testDriveItems: [] as TestDriveCarType[],
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

  function ourReducer(draft: TestDriveInitialStateTypes, action: TestDriveActionTypes) {
    switch (action.type) {
      case "handleExistingItems":
        draft.testDriveItems = action.value
        return
      case "deleteExistingItem":
        /* update state to remove from UI */
        draft.testDriveItems = draft.testDriveItems?.filter((x: TestDriveCarType) => {
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
        if (draft.description.value.length < 3) {
          draft.description.hasErrors = true
          draft.description.message = "Please enter a longer description"
        }
        return
      case "priceImmediately":
        draft.price.hasErrors = false
        draft.price.value = action.value
        if (draft.price.value == "") {
          draft.price.hasErrors = true
          draft.price.message = "Please enter a price"
        }
        if (+draft.price.value > 250000) {
          draft.price.hasErrors = true
          draft.price.message = "Enter a price under $250,000"
        }
        if (+draft.price.value < 1) {
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
        if (+draft.miles.value > 250000) {
          draft.miles.hasErrors = true
          draft.miles.message = "Please enter lower value for the miles"
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
        if (+draft.price.value > 250000) {
          draft.price.hasErrors = true
          draft.price.message = "You must enter a price."
        }
        if (+draft.price.value < 1) {
          draft.price.hasErrors = true
          draft.price.message = "The price cannot be less than $1"
        }
        if (typeof draft.miles.value === "string" && draft.miles.value.trim() === "") {
          draft.miles.hasErrors = true
          draft.miles.message = "You must enter a value for the miles."
        }
        if (+draft.miles.value < 0) {
          draft.miles.hasErrors = true
          draft.miles.message = "Mileage must be greater than 0."
        }
        if (+draft.miles.value > 300000) {
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

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  function newTestDriveCarHandler(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type: "submitForm" })
  }

  function deleteHandler(uniqueId: number) {
    // update local storage AND remove from UI
    const tdCarsInStorage: TestDriveCarType[] | null = JSON.parse(localStorage.getItem("tdCars") || "{}") as TestDriveCarType[] | null
    if (tdCarsInStorage !== null) {
      const updatedTdCarsInStorage: TestDriveCarType[] = tdCarsInStorage.filter(car => {
        if (car.uniqueId !== uniqueId) return car
      })
      localStorage.setItem("tdCars", JSON.stringify(updatedTdCarsInStorage))
      // remove from UI
      dispatch({ type: "deleteExistingItem", value: uniqueId })
    }
  }

  // load existing tdItems on page load
  useEffect(() => {
    if (localStorage.getItem("tdCars") !== null) {
      const existingTdItems: TestDriveCarType[] = JSON.parse(localStorage.getItem("tdCars") || "{}") as TestDriveCarType[]
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

  // define request to send inside useEffect
  async function fetchNewValidatedTdItem(newUnvalidatedTdItem: PrimaryCarFields, signal: AbortSignal) {
    try {
      const response = await fetch("/api/create-td-car", {
        signal: signal,
        method: "POST",
        body: JSON.stringify(newUnvalidatedTdItem),
        headers: { "Content-Type": "application/json" }
      })
      //console.log(`Response from /api/create-td-car:${response}`)
      const data = (await response.json()) as NewTDResponseType

      if (data.message !== "success") {
        appDispatch({ type: "flashMessage", value: "Could not add item" })
        throw { message: "error" }
      }

      const newValidatedTdItem = data.data
      console.log("newValidatedTdItem", newValidatedTdItem)
      if (newValidatedTdItem) {
        dispatch({ type: "addNewValidatedItem", value: newValidatedTdItem })
      }
      dispatch({ type: "clearFields" })
      appDispatch({ type: "flashMessage", value: "Car added" })
    } catch (err) {
      throw { message: "error", errors: err }
    }
  }

  // useEffect to submitForm Request if no validation errors
  useEffect(() => {
    if (state.submitCount) {
      const controller = new AbortController()
      const signal = controller.signal
      dispatch({ type: "saveRequestStarted" })
      //format new item to store and display
      const newUnvalidatedTdItem = {
        description: state.description.value.toString(),
        price: parseFloat(state.price.value),
        miles: parseFloat(state.miles.value),
        link: state.link.value.toString()
      }
      // need the async request in useEffect trick
      void fetchNewValidatedTdItem(newUnvalidatedTdItem, signal)
      return () => controller.abort()
    }
  }, [state.submitCount])

  return (
    <TDSection>
      <h2>Take it for a Spin - Enter Vehicle Details</h2>
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
        Assumed driving of 15,000 miles per year and useful life of 150,000 miles. Customize these values by <Link href="/register">signing up</Link> for a free account and also gain the ability to access your listings across multiple devices.
      </p>

      {state.testDriveItems.length >= 1 && (
        <TestDriveListGrid>
          {state.testDriveItems.map((item: TestDriveCarType) => {
            return <TestDriveListItemCard key={item.uniqueId} item={item} deleteHandler={deleteHandler} />
          })}
        </TestDriveListGrid>
      )}
    </TDSection>
  )
}
export default TestDrive
