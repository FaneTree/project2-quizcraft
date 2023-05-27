import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

import "../style/Auth.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Signin () {
    const [errMessage, setErrMessage] = useState(null);

    const _signInWithGoogle = async () => {
        try {
        const result = await signInWithPopup(auth, provider);
            cookies.set("auth-token", result.user.refreshToken);
        } catch (err) {
            console.error(err);
            setErrMessage(err);
        }
    };
    return (
        <div className="auth sign-in-div midtext">
            <p className="textwhite"> Sign In With Google To Continue </p>
            <button onClick={_signInWithGoogle}> Sign In With Google </button>
            {errMessage ? errMessage : null}
        </div>
    );
};
