import React, { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import {db} from "../firebase";

import Quiz from '../component/Quiz';
import WaitingRoom from "../component/WaitingRoom";
import Chatroom from "../component/Chatroom";

// import ChatRoom from '../Multiplayer/Main';

export default function Player () {
    const navigate = useNavigate()
    let { gameId, playerId } = useParams();
    const [showQuiz,setShowQuiz] = useState(false);
    const gameID = gameId;
    const gamesDocRef = doc(db, "games", gameID.toString());

    const [gameStatus,setGameStatus] = useState(false);

    // listen for the gamestatus change 
    useEffect(()=>{
        const unsubGameEnd = onSnapshot(gamesDocRef,
            snapshot =>
                setGameStatus(snapshot.data().room.gameEnd)
        );
        return () => unsubGameEnd();
    },[])
    
    useEffect(()=>{
        console.log("game status changing???? --- ", gameStatus)
        if(gameStatus === true){
            return navigate(`/scoreboard/${gameID}`)
        }
    },[gameStatus])

    const _handleClick = ()=>{
        setShowQuiz(!showQuiz)
    }

    return (
        <div>
            {/* {gameID} */}
            { showQuiz &&
                <div>
                    <Quiz a = { gameID } />
                    <Chatroom room = { gameID } />
                    {/* <button onClick={ _handleClick }>Room</button> */}
                </div>
            }
            { !showQuiz &&
                <div className="auth">
                    <button onClick={ _handleClick } className="transparent-button">Play quiz</button>
                    <WaitingRoom a = { gameID } />
                </div>
            }
            {/* <ChatRoom /> */}
        </div>
    )
}