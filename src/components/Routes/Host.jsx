import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";

import Quiz from '../component/Quiz';
import WaitingRoom from "../component/WaitingRoom";
import Chatroom from "../component/Chatroom";
// import ChatRoom from '../Multiplayer/Main';


export default function Host () {
    const navigate = useNavigate();
    const [showQuiz, setShowQuiz] = useState(false);
    const [gameStatus, setGameStatus] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [roomData, setRoomData] = useState([]);

    let { gameId, playerId } = useParams();
    const gameID = gameId;
    const gamesDocRef = doc(db, "games", gameID.toString());

    const unsub = onSnapshot(doc(db, "games", gameID), (doc) => {
        console.log("Current data: ", doc.data());
    });
    unsub();

    const _showQuiz = () => {
        setShowQuiz(!showQuiz);
        console.log(showQuiz);
    }

    // onSnapshot to fetch roomData
    useEffect(() => {
        const unsubRoomData = onSnapshot(gamesDocRef,
            snapShot => {
                setRoomData(snapShot.data().room);
            });
        return () => unsubRoomData();
    }, []);

    // use OnSnapshot to fetch currentQuestion from Database;
    useEffect(
        ()=>{
            const unsubCurrentQuestion = onSnapshot(gamesDocRef,
                snapshot =>
                    setCurrentQuestion(snapshot.data().room.currentQuestion)
            );
            return () => unsubCurrentQuestion();
        },[])

    useEffect(()=>{
        console.log("current Question Number: ", currentQuestion)
    },[currentQuestion])

    // use onSnapshot to fetch gameEnd from Database;
    // useEffect(()=>{
    //     const unsubGameEnd = onSnapshot(gamesDocRef,
    //         snapshot =>
    //             setGameStatus(snapshot.data().room.gameEnd)
    //     );
    //     return () => unsubGameEnd();
    // },[gameStatus])

    const _handleClick = ()=>{
        if (currentQuestion < (roomData.questions.length - 1 )) {
            setCurrentQuestion(currentQuestion + 1);

            // update the currentQuestion number in the firestore
            updateDoc(doc(db, "games", gameID.toString()), {
                room: {
                    ...roomData,
                    currentQuestion: currentQuestion + 1
                }
            })
        }else{
            console.log("Game Over, Moving to Final Results");
            
            // update the gameEnd in the firestore
            updateDoc(doc(db, "games", gameID.toString()), {
                room: {
                    ...roomData,
                    gameEnd: true,
                }
            })
            navigate(`/scoreboard/${gameID}`)
        }
    }
    
    return (
        <div className="  " >
            { showQuiz &&
                <div className="" >
                    <Quiz a = { gameID } /> 
                    {/* change current question + 1*/}
                    <section className="">
                    <button onClick={ _handleClick } className="transparent-button">Next</button>
                    </section>
                    <Chatroom room = { gameID } />
                    {/* <button onClick ={ _showQuiz } className="midbutton lobbydiv auth">Lobby</button> */}
                </div>
            }

            { !showQuiz &&
                <div className="">
                    <div className="auth ">
                    <button className="midtag">Start</button>
                    <button onClick = { _showQuiz } className="midtag">Quiz</button>
                    </div>
                    <WaitingRoom a = { gameID } />
                    {/* <ChatRoom /> */}
                    {/* change game status to true */}
                </div>
            }
        </div>
    );
}