// import Users from './User/Users';
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "../App.scss";

import NavBar from "./NavBar";

import Home from "./Routes/Home";
import Signin from "./Routes/Signin";
import Listgames from "./component/Listgames";

import Consoles from "./Routes/Consoles";
import Player from "./Routes/Player";
import Host from "./Routes/Host";

import Challenges from "./Routes/Challenges";
import ChatRoom from "./Mutiplayer/Main";

import FinalResult from "./Routes/FinalResult";

function App() {
  const [bodyStyle, setBodyStyle] = useState("style1");

  const handleClick = () => {
    // rotate through the different body styles
    if (bodyStyle === "style1") {
      setBodyStyle("style2");
    } else if (bodyStyle === "style2") {
      setBodyStyle("style3");
    } else {
      setBodyStyle("style1");
    }
  };
  return (
    <div className="App">
      <NavBar />
      <div className="Content">
        <Routes>
          {/* reguar path */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signin" element={<Signin />} />
          <Route exact path="/listgames" element={<Listgames />} />

          {/* for game : create, host, and player */}
          <Route exact path="/games/create" element={<Consoles />} />
          <Route exact path="/play/:gameId/as/:playerId" element={<Player />} />
          <Route exact path="/host/:gameId/as/:playerId" element={<Host />} />

          {/* for single player and chat feature */}
          <Route exact path="/single" element={<Challenges />} />
          <Route exact path="/chatroom" element={<ChatRoom />} />

          {/* after the game finished */}
          <Route exact path="/scoreboard/:gameId" element={<FinalResult />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
