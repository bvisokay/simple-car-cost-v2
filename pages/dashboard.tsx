import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { runServerSidePageGuard } from "../lib/auth"
import Link from "next/link"
import Head from "next/head"
import { Session } from "next-auth"
//comps
import { Wrapper, Section } from "../styles/GlobalComponents"
import { breakpoints } from "../styles/breakpoints"

import styled from "styled-components"

// icons
import { IoIosList, IoIosRefreshCircle, IoMdAddCircle, IoIosCog, IoIosBulb } from "react-icons/io"

const DashboardItem = styled.div`
  border: 2px solid var(--primary);
  border-radius: 4px;
  padding: 0.5rem 0.5rem;
  display: flex;
  width: 100%;
  margin: 0.75rem auto;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  color: var(--primary);
  align-items: center;

  @media ${breakpoints.sm} {
    padding: 1rem 0.5rem;
    margin: 1.5rem auto;
  }

  a.dashboard-icon {
    margin-right: 0.5rem;

    @media ${breakpoints.sm} {
      margin-right: 1.25rem;
    }
  }

  svg {
    font-size: 2rem;
    margin-top: 0.25rem;

    :hover {
      cursor: pointer;
    }
  }

  a {
    font-size: 0.875rem;
    color: var(--primary);

    @media ${breakpoints.xs} {
      font-size: 1rem;
    }

    @media ${breakpoints.sm} {
      font-size: 1.25rem;
    }

    @media ${breakpoints.md} {
      font-size: 1.5rem;
    }

    :hover {
      text-decoration: none;
    }

    :visited {
      color: var(--primary);
    }
  }
`

type Props = {
  session?: Session
}

const DashboardPage = ({ session }: Props) => {
  return (
    <>
      <Head>
        <title>Dashboard | Simple Car Cost</title>
      </Head>

      <Wrapper>
        <Section>
          <h2>Welcome {`${session!.user!.name!.charAt(0).toUpperCase()}${session!.user!.name!.slice(1)}`}</h2>
          <hr />
          <DashboardItem>
            <Link href="/create-item">
              <a className="dashboard-icon">
                <IoMdAddCircle />
              </a>
            </Link>
            <Link href="/create-item">Add Car</Link>
          </DashboardItem>

          <DashboardItem>
            <Link href="/list">
              <a className="dashboard-icon">
                <IoIosList />
              </a>
            </Link>
            <Link href="/list">View your list</Link>
          </DashboardItem>

          <DashboardItem>
            <Link href="/settings">
              <a className="dashboard-icon">
                <IoIosCog />
              </a>
            </Link>
            <Link href="/settings">Update your settings</Link>
          </DashboardItem>

          <DashboardItem>
            <Link href="/change-password">
              <a className="dashboard-icon">
                <IoIosRefreshCircle />
              </a>
            </Link>
            <Link href="/change-password">Update your password</Link>
          </DashboardItem>

          <DashboardItem>
            <Link href="/overview">
              <a className="dashboard-icon">
                <IoIosBulb />
              </a>
            </Link>
            <Link href="/overview">Learn More</Link>
          </DashboardItem>
        </Section>
      </Wrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await runServerSidePageGuard(context)
  return session
}

export default DashboardPage
