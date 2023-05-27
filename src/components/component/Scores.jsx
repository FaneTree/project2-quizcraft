import React from "react";

export default function Scores (props){

    return(
        <div>
            <h3>Scores: { props.currentScore }</h3>
            <h3>{ props.currentMessage }</h3>
        </div>
    )
}