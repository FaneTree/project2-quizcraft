import React, { useState } from "react";

import { Chat } from "./Chat";
import { Auth } from "../Mutiplayer/Auth";
import { Wrapper } from "../Mutiplayer/Wrapper";

import "../style/Main.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

function ChatRoom() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");

  if (!isAuth) {
    return (
      <Wrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
        <Auth setIsAuth={setIsAuth} />
      </Wrapper>
    );
  }

  return (
    <Wrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {!isInChat ? (
        <div className="auth lobbytag joinbutton textwhite">
          <p style={{ fontSize: "30px" }}> Type room code: </p>
          <input
            onChange={(e) => setRoom(e.target.value)}
            style={{ height: "50px", fontSize: "25px" }}
            required
          />
          <button
            onClick={() => {
              setIsInChat(true);
            }}
            style={{ fontSize: "30px" }}
          >
            Enter room
          </button>
        </div>
      ) : (
        <Chat room={room} />
      )}
    </Wrapper>
  );
}

export default ChatRoom;
