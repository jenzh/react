import React from 'react';

function Square(props) {
    return (
        <button
            className={props.style}
            onClick={() => props.onClick()}
        >
        {props.value}
        </button>
    );
}

export default Square;