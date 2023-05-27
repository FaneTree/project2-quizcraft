import React from 'react';

export default function Score(props) {

    return (
        <div className="midtag">
            Current points: { props.points }
        </div>
    )
}