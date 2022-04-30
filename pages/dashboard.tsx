import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/client"
//comps
import { Wrapper, Section } from "../styles/GlobalComponents"

const DashboardPage = (props: any) => {
  return (
    <Wrapper>
      <Section>
        <h2>Welcome {props.session.user.name}</h2>
        <p>Add a new item</p>
        <p>View your list</p>
        <p>Update your settings</p>
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