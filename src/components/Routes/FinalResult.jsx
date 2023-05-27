import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot } from 'firebase/firestore';
import { useParams } from "react-router-dom"
import _ from 'underscore';



export default function FinalResult(props){
    let { gameId, playerId } = useParams();
    const gameID = gameId;
    console.log(props,'@@@@')
    const gamesDocRef = doc(db, "games", gameID.toString());
    let sortedPlayers = {}

    // const playersScore = {}; // put data like { 0 : {username: dfdf, score: 5}} => 0 is rank

    // const unsub = onSnapshot(doc(db, "games", gameID), (doc) => {
    //     console.log("Current data: ", doc.data());
    // });

    const [attempts, setAttempts] = useState([]);
    const [summary, setSummary] = useState([]);
    //use onSnapshot to retrieve the attempts data
    useEffect(()=>{
        const unsubAttempts = onSnapshot(gamesDocRef,
            snapshot => {
            setAttempts(snapshot.data().room.attempts);
            });
        return () => unsubAttempts();
    },[])

    // function to process the attempts data
    const processAttempts = (attempts) => {
        Object.entries(attempts).map(([playerName, scoreArr], index)=>{
            const scoreSum = scoreArr.reduce((a, b) => a + b, 0);
            const result = {[playerName]: scoreSum}
            setSummary({
              ...summary,
                result
            })
        })
    }
    useEffect(()=>{
        processAttempts(attempts);
    },[attempts])

    // useEffect(()=>{
    //     sortedPlayers = _.chain(summary)
    //         .map((value, key) => ({name: key, score: value}))
    //         .sortBy('score')
    //         .value();
    // },[summary])

    useEffect(()=>{
        console.log('Final results attempts ==== ', attempts, 'Processed Attempts ==== ', summary)
        // console.log('sortedPlayers ==== ', sortedPlayers)
    },[attempts, summary])




    //

    if(attempts !== []){
    return (
        <div>
            <h2>Final Result:</h2>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Player Name</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Score</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(attempts).map(([name, array], index) => (
                    <tr key={index}>
                        <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{name}</td>
                        <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{array.reduce((a, b) => a + b, 0)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>


    )}else{
        return (
            <div>
                <h2>Loading ...</h2>
            </div>
        )
    }
}