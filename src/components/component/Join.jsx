import React, { useState, useEffect }from "react";
import {useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase.js';
import {doc, setDoc, addDoc, updateDoc, onSnapshot, arrayUnion} from "firebase/firestore";
import {db} from "../firebase";

export default function Join () {
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState(null);
    const [user] = useAuthState(auth);

//     const [roomData, setRoomData] = useState([]);
//     // onSnapshot to fetch roomData
//     useEffect(() => {
//     const unsubRoomData = onSnapshot(doc(db, "games", joinId),
//         snapShot => {
//            setRoomData(snapShot.data().room);
//          });
//      return () => unsubRoomData();
//    }, []);

    const joinRoomURL = user ? `/play/${ joinId }/as/${ user.uid }` : '/';

    // form to fill room number => record player into room => redirect to room
    const _recordAndNavigatePlayer = () => {
        console.log(user.displayName);
        const username = user.displayName;
        const docRef = doc(db, "games", `${joinId}`);
        const playerData = {
            "room.players" : arrayUnion({username})
        };
        console.log('Player Data is',playerData);
        updateDoc (docRef, playerData );
        navigate(joinRoomURL);
    }
    
    return (
        <div className="auth lobbytag joinbutton two">
            <input placeholder= 'Room ID' onChange={ (event) => setJoinId(event.currentTarget.value) } style={{ height: '50px', fontSize: '25px' }} />
            <button onClick= { _recordAndNavigatePlayer } style={{ fontSize: '30px' }}>Join Room</button>
        </div>
    );
}