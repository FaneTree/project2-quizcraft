import React, { useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot } from 'firebase/firestore';

export default function WaitingRoom(props){
    const gameID = props.a;
    // const playersList = [];
    const gamesDocRef = doc(db, "games", gameID.toString());

    const [playersList,setPlayersList] = React.useState([]);

    useEffect(()=>{
        const unsubPlayersList = onSnapshot(gamesDocRef, (snapshot) => {
            setPlayersList(snapshot.data().room.players || []);
        });
        return () => unsubPlayersList();
    },[])


    // useEffect (() => {
    //     const unsub = onSnapshot(doc(db, "games", gameID), (doc) => {
    //         doc.data().players.map(x => playersList.push(x));
    //         console.log(playersList);
    //     })
    //     return () => unsub();
    // }, []);
    
    return (
        <div>
            <div className="auth midtext displayblock">
            <p>Room ID: { gameID }</p>
            <p>Players in room :</p> 
            {console.log("Player List ===== ", playersList)}
            </div>
            <div className="auth">
            <ul>
                { playersList.map((item, index) =>(
                <li key={index}>
                    {item.username}
                </li>))}
            </ul>
            </div>
        </div>
    )
}