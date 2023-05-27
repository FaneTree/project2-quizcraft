import React, { useEffect, useState } from "react";
import {getDoc, doc, updateDoc, onSnapshot, setDoc} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Quiz(props) {
  const gameID = props.a;
  // reference to the specific document in the games collection
  const gamesDocRef = doc(db, "games", gameID.toString());

  const [user] = useAuthState(auth);
  const currentUser = user.displayName;

  const [roomData, setRoomData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [attempts, setAttempts] = useState({[currentUser]:[]});
  // const attempts = {[currentUser]:[]} // to record the score of a question and send it to firestore
  //   console.log(attempts);


  const currentHost = roomData.host;

  // onSnapshot to fetch roomData
  useEffect(() => {
   const unsubRoomData = onSnapshot(gamesDocRef,
       snapShot => {
          setRoomData(snapShot.data().room);
        });
    return () => unsubRoomData();
  }, []);

  // onSnapshot to fetch questionData
  useEffect(()=>{
      const unsubQuestionData = onSnapshot(gamesDocRef,
          snapshot =>
              setQuestionData(snapshot.data().room.questions)
          );
      return () => unsubQuestionData();
  },[])

  // onSnapshot to look for the change of currentQuestion number
    useEffect(
        ()=>{
            const unsubCurrentQuestion = onSnapshot(gamesDocRef,
                snapshot =>
            setCurrentQuestion(snapshot.data().room.currentQuestion)
            );
            return () => unsubCurrentQuestion();
        },[currentQuestion])


  // TODO: remove it later : checking purpose only
  useEffect(() => {
    console.log("room Data ==== ", roomData);
    console.log("Question data ==== ", questionData);
    console.log("Current question ==== ", currentQuestion);
    console.log("Current host ==== ", currentHost);
    console.log("Current user ==== ", currentUser);
  }, [roomData, questionData, currentQuestion, currentHost,currentUser]);


  const scoreCalculate = (flag)=>{
      return flag? 1:0;
  }

  // function to push the new player attempt to the database

  const _handleAnswerClick = (e) => {
      const answer = e.target.value;
      // just be careful, I don't know why the dat structure is nested in this way after migration
      const correctAnswer = questionData[currentQuestion][currentQuestion].correct;
      console.log("you answer === ", answer, "& correct answer === ", correctAnswer);

      // check if the answer clicked is correct or not
      const flag = answer.toString() === correctAnswer.toString() ? true : false;
      const score = scoreCalculate(flag);
      console.log("flag ==== ", flag, "score ==== ", score);

      attempts[currentUser][currentQuestion] = score
      console.log("attempt ==== ", attempts);
      const updatedAttempts = {...attempts}
      setAttempts(updatedAttempts);

      // push the attempts data to the firestore
      setDoc (doc(db, "games", gameID.toString()), {
          room: {
              ...roomData,
              attempts: {...roomData.attempts, ...attempts}
          }
      }).catch(error => console.log(error.message))
  }

  return (
      <div>
        <p>
          Dear <strong>{currentUser}</strong>, Welcome to Game Room
          <strong>{props.a}</strong>
        </p>
        <p>
          The Host is <strong>{currentHost}</strong>
        </p>

        {questionData.map((question, index) => {
          if (index === currentQuestion) {
            return (
                <div key={index}>
                  <p>
                    Queston #{index + 1}: {question[index].questionText}
                  </p>
                    {/* <p>{ question[currentQuestion].correct }</p> */}
                  <ol>
                    {question[index].shuffledAnswers.map((answer, index) => (
                        <li key={index}>
                          <button value={answer} onClick={_handleAnswerClick}>
                            {answer}
                          </button>
                        </li>
                    ))}
                  </ol>
                </div>
            );
          }
          return null;
        })}
      </div>
  );
}
