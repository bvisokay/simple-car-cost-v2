import { verify } from "jsonwebtoken"

const Profile = (props: any) => {
  return (
    <div>
      <p>
        <strong>{props.user && `Welcome, ${props.user.charAt(0).toUpperCase() + props.user.slice(1)}`}</strong>
      </p>
    </div>
  )
}
export default Profile

export async function getServerSideProps(context: any) {
  const { cookies } = context.req
  const jwt = cookies.SimpleCarCostToken
  let user: any = null
  if (jwt === undefined) {
    user = ""
  }
  try {
    const jwtPayload: any = verify(jwt, process.env.JWTSECRET!)
    if (jwtPayload) {
      user = jwtPayload.username
    }
  } catch (e) {
    user = ""
  }

  return {
    props: {
      user
    }
  }
}
