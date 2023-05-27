import React, {useEffect, useState} from 'react';
import Select from "react-dropdown-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {doc, setDoc, addDoc} from "firebase/firestore";
import {db} from "../firebase";
import { auth } from '../firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';

const CATEGORIES_URL = "https://opentdb.com/api_category.php";

export default function Consoles(){
    const navigate = useNavigate();
    // trivia API //////////////////
    // Category:
    const [categories, setCategories] = useState([]); // for API
    const [category, setCategory] = useState(""); // for after-selection
    // call the category API and store the info to the state
    useEffect(() => {
        axios.get(CATEGORIES_URL).then((response) => {
            setCategories(response.data.trivia_categories);
        });
    }, []);

    // Difficulty:
    const [difficulty, setDifficulty] = useState(null);
    const difficulties = [
        {id:1, name:"Easy"},
        {id:2, name:"Medium"},
        {id:3, name:"Hard"}];

    const [questionCount, setQuestionCount] = useState(0);

    const [timerSet, setTimerset] = useState(10);



    /////////////////////////
    // Question Text Cleansing: converts html code to regular characters
    function removeCharacters(question) {
        // regex aye
        return question.replace(/(&quot\;)/g, "\"").replace(/(&rsquo\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\"");
    }
    // this random number becomes the Document ID in the 'games' collection
    const new_path = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    // this user will be pushed into the same document and set as 'Host'
    const [user] = useAuthState(auth);

    // this redirect url generate from new_path and user_id
    const redirectUrl = `/host/${ new_path }/as/${ user.uid }`

    // function to shuffle the answer array before being pushed to Firestore
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Function: 1) receive API data and store them in different States; 2) pass the data to Firestore
    const fetchQuestions = ({ questionCount, category, difficulty }) => {
        const url = `https://opentdb.com/api.php?amount=${ questionCount }&category=${ category }&difficulty=${ difficulty.toLowerCase() }&type=multiple`;
        axios.get(url)
            .then((response) => {
                const questionsToFirestore = response.data.results.map((result, index) => {
                    return {
                        [index]: {
                            questionText: removeCharacters(result.question),
                            correct: removeCharacters(result.correct_answer),
                            incorrect: result.incorrect_answers,
                            shuffledAnswers: shuffle([...result.incorrect_answers, result.correct_answer]),
                        }
                    };
                });
                console.log("Question Set Sent to Firestore: ", questionsToFirestore);
                const gameData = {
                    questions: questionsToFirestore,
                    host: user.displayName,
                    currentQuestion: 0, 
                    gameEnd: false,
                    timer: timerSet
                };
                return gameData;
            }) // send the data to Firestore
            .then((gameData) => {
                const docRef = doc(db, "games", new_path);
                setDoc (docRef, {room: gameData });
                // addDoc (docRef,  {host:user.displayName})
            })
            .catch(error => {
                console.error(error);
            });
 
    };

    const handleCategoryChange = (selectedItems) => {
        const categoryId = selectedItems[0].id;
        setCategory(categoryId);
    }

    const handleDifficultyChange = (selectedItems) => {
        const difficultyId = selectedItems[0].name;
        setDifficulty(difficultyId);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchQuestions({ questionCount, category, difficulty, timerSet });
        setTimeout(navigate(redirectUrl),4000); 
    }

    return(
        <div className='midtext'>
            <h3 className="midtag">Quiz Consoles</h3>
            <form onSubmit={handleSubmit}>
                <section className="midtag">
                    Number of questions: 
                    <input type="number" name="questionCount" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} min="1" max="15" style={{ fontSize: '25px' }}/>
                </section>
                <section className="midtag">
                    Category:
                    <Select options={categories} labelField='name' valueField='id' onChange={handleCategoryChange} className="whitehover" />
                </section >
                <section className="midtag">
                    Difficulty:
                    <Select options={difficulties} labelField='name' valueField='id' onChange={handleDifficultyChange} className="whitehover" />
                </section>
{/* <<<<<<< HEAD
                <section className="midtag">
                    Timer in seconds: 
                    <input type="number" name="timerCount" value={timerSet} onChange={(e) => setTimerset(e.target.value)} min="10" max="60" style={{ fontSize: '25px' }}/>
                </section>
                <section className="midtag"> */}

                {/* <section>
                    Timer in seconds: 
                    <input type="number" name="timerCount" value={timerSet} onChange={(e) => setTimerset(e.target.value)} min="10" max="60" style={{ fontSize: '25px' }}/>
                </section> */}
                <section className='midtag'>

                <input type="submit" value="Submit" class="transparent-button"/>
                </section>
            </form>
        </div>
    )
}
