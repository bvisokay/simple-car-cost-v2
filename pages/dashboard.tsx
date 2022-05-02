import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/client"
import Link from "next/link"
//comps
import { Wrapper, Section } from "../styles/GlobalComponents"

const DashboardPage = (props: any) => {
  return (
    <Wrapper>
      <Section>
        <h2>Welcome {props.session.user.name}</h2>
        <br />
        <Link href="/create-item">
          <a>Add a new item</a>
        </Link>
        <p>View your list</p>
        <p>Update your settings</p>
        <Link href="/change-password">
          <a>Update your password</a>
        </Link>

        <p>Learning Center</p>
      </Section>
    </Wrapper>
  )
}

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

  return {
    props: {
      session
    }
  }
}

export default DashboardPage
