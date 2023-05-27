import React from 'react';
import { MenuData, MenuDataLogin } from './MenuData';
import { Link } from "react-router-dom";

import { auth } from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';

import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const NavBar = () => {
    const [user] = useAuthState(auth);
    const _signUserOut = async () => {
        await signOut(auth);
        cookies.remove("auth-token");
      };

const  changeBodyStyle = () =>  {
    document.body.classList.toggle("style1")
    document.body.classList.toggle("style2")
}
    return(
        <nav className = 'nav'>
            <div className='logo'>
                <img className='logo'
                    src="https://i.ibb.co/Hhhjqwr/Quizcraft-3.png" alt="cauldron-800-300-px" 
                    width="200" 
                onClick={changeBodyStyle}
                />
                {/* <h1>QuizCraft</h1> */}
            </div>
            <ul>
                {MenuData.map((item,index) => {
                    return (
                        <li key = {index}>
                            <Link to = {item.url}>
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
                { user ? 
                <li>
                    <a onClick = {_signUserOut} href = "/" > Sign out ({ user.displayName })</a>
                </li> 
                : MenuDataLogin.map((item,index) => {
                        return (
                            <li key = {index}>
                                <Link to = {item.url}>
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
}

export default NavBar;