import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Session } from "next-auth"
import { getSession } from "next-auth/client"
import { useState, useContext } from "react"
import { breakpoints } from "../styles/breakpoints"
import { Wrapper, Section } from "../styles/GlobalComponents"
import Car from "../models/Car"
import CarListItemCard from "../components/CarListItemCard/CarListItemCard"
import Link from "next/link"
import styled from "styled-components"
import { GlobalDispatchContext } from "../store/GlobalContext"
import { IoSettings } from "react-icons/io5"

const ListPageHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media ${breakpoints.xs} {
    flex-direction: row;
  }

  h2 {
    font-size: 1.5rem;

    @media ${breakpoints.sm} {
      font-size: 1.875rem;
    }
  }
`

const SettingsBadge = styled.div`
  border: 1px solid var(--primary);
  border-radius: 8px;
  letter-spacing: -0.5px;
  font-style: italic;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.1rem 0.25rem;
  margin-top: 0.5rem;
  background-color: var(--primary);
  margin-left: 0.25rem;

  @media ${breakpoints.xs} {
    margin-top: 0rem;
  }

  svg {
    font-size: 1.5rem;
    fill: white;
    margin-right: 0.5rem;

    :hover {
      fill: var(--indigo);
    }
  }

  .settings-badge__text p {
    color: white;
    font-size: 0.6rem;
    line-height: 0.2rem;
  }

  /* .settings-badge__text p span {
    color: var(--gray);
  } */
`

interface CarInList {
  carId: string
  description: string
  price: number
  miles: number
  link: string
  createdDate: string
  rem_months: number
  cprm: number
}

type Props = {
  session?: Session
  carData?: CarInList[]
  userData?: {
    user_id: string
    useful_miles: number
    monthly_miles: number
  }
}

const List = ({ session, carData, userData }: Props) => {
  const [cars, setCars] = useState(carData)

  const appDispatch = useContext(GlobalDispatchContext)

  const deleteItem = (carId: string) => {
    const controller = new AbortController()
    const signal = controller.signal
    async function sendDeleteRequest() {
      try {
        //appDispatch({ type: "flashMessage", value: "Sent Request to API" })
        const response = await fetch("/api/delete-item", {
          signal,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            carId: carId
          })
        })
        const data = await response.json()
        if (data.error) {
          appDispatch({ type: "flashMessage", value: data.error })
          //console.warn(`from client: ${data.error}`)
          return
        }
        if (data.message === "success") {
          appDispatch({ type: "flashMessage", value: "Car removed" })
          setCars(
            cars?.filter((car: CarInList) => {
              return car.carId !== carId
            })
          )

          //console.log(data.data)
          return
        }
      } catch (err) {
        appDispatch({ type: "flashMessage", value: "Could not remove car" })
        //console.error(err)
      }
    }
    void sendDeleteRequest()
    return () => controller.abort()
  }

  return (
    <Wrapper>
      <Section>
        <ListPageHeading>
          {session !== undefined && session !== null && (
            <h2>
              {session.user?.name?.charAt(0).toUpperCase()}
              {session.user?.name?.slice(1)}&apos;s List
            </h2>
          )}

          {userData && (
            <SettingsBadge>
              <Link href="/settings">
                <a>
                  <IoSettings />
                </a>
              </Link>
              <div className="settings-badge__text">
                <p>
                  Annual Miles: <span>{(userData.monthly_miles * 12).toLocaleString()}</span>
                </p>
                <p>
                  Useful Miles: <span>{userData.useful_miles.toLocaleString()}</span>
                </p>
              </div>
            </SettingsBadge>
          )}

          {/* <p>Sort &amp; Filter Icon</p> */}
          {/* <p>Clear All</p> */}
        </ListPageHeading>
        <hr />
        {cars?.length && cars?.length === 1 ? <p>You have 1 car in your list</p> : ""}
        {cars?.length && cars?.length > 1 ? <p>You have {cars.length} cars in your list</p> : ""}
        {!cars?.length && (
          <>
            <br />
            <p>
              You have no cars in your list.{" "}
              <Link href="/create-item">
                <a>Add a car</a>
              </Link>{" "}
              to get started.
            </p>
          </>
        )}
        {/* <FormControl>
          <select
            name=""
            onChange={e => {
              alert(e.target.value)
            }}
          >
            <option value="priceAsc">Price Ascending</option>
            <option value="priceDesc">Price Descending</option>
            <option value="milesAsc">Miles Ascending</option>
            <option value="milesDesc">Miles Descending</option>
            <option value="cprmASC">Lowest Cost Per Rem Mo</option>
          </select>
        </FormControl>
          <hr /> */}
        <ul>{cars?.length ? cars.map(item => <CarListItemCard key={item.carId} item={item} deleteItem={deleteItem} />) : <></>}</ul>
      </Section>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession({ req: context.req })
  // redirect away from page if there is no session
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const username = session.user!.name!.toString()

  let data

  try {
    data = await Car.findByAuthor(username)
    console.log(data)
  } catch (err) {
    throw { message: "error", errors: err }
  }

  // send session and vehicle data as props
  return {
    props: {
      session,
      carData: data?.carData,
      userData: data?.userData
    }
  }
}

export default List
