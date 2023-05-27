import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import "../style/Auth.css";
import "../style/Main.css";
import "../style/Chat.css";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="auth sign-in-div midtext">
      <p className="textwhite"> Sign In With Google To Continue </p>
      <button onClick={signInWithGoogle}> Sign In With Google </button>
    </div>
  );
};
