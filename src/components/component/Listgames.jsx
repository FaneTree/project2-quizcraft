import React,{ useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Listgames(){
    const [games, setGames] = useState([]);

    // call the getGames function when the component is mounted
    useEffect(()=>{
        getGames();
    },[]);


    // check out what's in the state
    // useEffect(
    //     ()=>{
    //         console.log("games state ==== ",games);
    //     },
    //     [games]
    // )
    function getGames(){
        const gamesCollectionRef = collection(db, 'games');
        getDocs(gamesCollectionRef).then((response) => {
            console.log('getDoc response: ', response.docs[0].data()); // docs and data() are both methods from Firestore
            const questions = response.docs.map(doc=>({
                id: doc.id,
              ...doc.data()
            }))
            console.log("questions passed to the state ==== ", questions);
            setGames(questions);
        }).catch(error=>console.log(error.message));
    }

    // converts html code to regular characters
    function removeCharacters(question) {
        // regex aye
        return question.replace(/(&quot\;)/g, "\"").replace(/(&rsquo\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\"");
    }

    return (
        <div>
            <h1>List Games</h1>
            <p>This child componet will be later removed.</p>
            <p>It's mainly to test the path of fetching data from Firestore.</p>
            {games.map((game) => (
                <div key={game.id}>
                    <h4>This is Game# {game.id}</h4>
                    {game.questions.map((question, index) => (
                        <div key={ index }>
                            <p>This is Question# { index }</p>
                            <p>The question is: {removeCharacters(question[index].questionText)}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );


}
