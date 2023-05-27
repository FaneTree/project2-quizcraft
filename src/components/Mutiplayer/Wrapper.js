import { db, auth, usersRef } from "../firebase";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { where, query, deleteDoc, getDocs } from "firebase/firestore";
const cookies = new Cookies();

export const Wrapper = ({ children, isAuth, setIsAuth, setIsInChat }) => {
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setIsInChat(false);
  };

  const removeUser = async () => {
    console.log("removing user");
    const q = query(
      usersRef,
      where("user", "==", auth.currentUser.displayName)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(function (doc) {
      deleteDoc(doc.ref);
    });
  };

  return (
    <div className="lobby-banner">
      {/* <div className="app-header">
        <h1> Game Lobby </h1>
      </div> */}

      <div className="app-container">{children}</div>
      {isAuth && (
        <div className="sign-out">
          {/* <button
            onClick={() => {
              signUserOut();
              removeUser();
            }}
          >
            Sign Out
          </button> */}
        </div>
      )}
    </div>
  );
};
