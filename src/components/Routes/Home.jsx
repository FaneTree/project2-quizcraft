import React, { useState }from "react";
import {useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";

import Signin from "./Signin";
import Join from '../component/Join';

import "../style/Auth.css";

import { auth } from '../firebase.js';
import { signOut } from "firebase/auth";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Home (){
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState(null);

    const [user] = useAuthState(auth);
    const _signUserOut = async () => {
        await signOut(auth);
        cookies.remove("auth-token");
      };

    const createRoomURL = "/games/create"
    const joinRoomURL = user ? `/play/${ joinId }/as/${ user.uid }` : '/';

    // function to navigate after create
    const _navigateCreate = () => {
        navigate(createRoomURL)
    }

    // function to put data into firestore and navigate to player
    const _recordAndNavigatePlayer = () => {
        console.log(user.displayName);
        navigate(joinRoomURL)
    }
    
    return (
        <div>
            { user ? 
                // <div className="auth lobbytag">
                //     <div className="auth lobbytag">
                //     <div>
                //     <button onClick= { _navigateCreate } className="enterbutton" style={{ fontSize: '30px' }} >Create Lobby</button>
                //     </div>
                //     <div className="joinbutotn two">
                //     <input
                //     placeholder="Game ID"
                //     onChange={(event) => setJoinId(event.currentTarget.value)}
                //     style={{ height: '50px', fontSize: '30px' }}
                //     />
                //     <button onClick= { _recordAndNavigatePlayer } style={{ fontSize: '30px' }}>Join Lobby</button>
                //     </div>
                // </div>
                //     {/* <p>{ user.displayName }</p> */}
                //     {/* <button onClick={ _signUserOut}>Sign out</button> */}

                <div className="auth lobbytag">
                    
                    <button onClick= { _navigateCreate } className="enterbutton" style={{ fontSize: '30px' }}>Create Room</button>
                    
                    <Join />
                    
                    {/* <p>{ user.displayName }</p>
                    <button onClick={ _signUserOut}>Sign out</button> */}

                </div>
                : 
                <Signin /> 
            }
        </div>
    )
}