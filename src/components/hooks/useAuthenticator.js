import { useSignIn } from "react-auth-kit";

export default function Authenticator(data) {
  
  const signIn = useSignIn();

  const signInUser = (data) => {
    signIn(data);
  }

  return signInUser;
}