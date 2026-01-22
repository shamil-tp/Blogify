import { GoogleLogin } from "@react-oauth/google"

function Login() {

  return (
    <>

      <GoogleLogin onSuccess={(credentialResponse)=>{
        console.log(credentialResponse)
      }}
      onError={()=>console.log("Login Failed")}
      />
    </>
  )
}

export default Login