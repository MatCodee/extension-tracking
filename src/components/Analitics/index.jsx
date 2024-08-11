import React from 'react';
import "./index.css";

const Analitics = () => {
    return (
        <>
            <ul>
                <li>
                    <div style={{backgroundColor: "red"}} className="circle"></div>
                    <p>Entretenimiento</p>
                </li>
                <li>
                    <div style={{backgroundColor: "blue"}} className="circle"></div>
                    <p>Aprender</p>
                </li>
                <li>
                    <div style={{backgroundColor: "yellow"}} className="circle"></div>
                    <p>Social</p>
                </li>
                <li>
                    <div style={{backgroundColor: "orange"}} className="circle"></div>
                    <p>Otros</p>
                </li>
                <li>
                    <div style={{backgroundColor: "green"}} className="circle"></div>
                    <p>Juegos</p>
                </li>
                <li>
                    <div style={{backgroundColor: "blue"}} className="circle"></div>
                    <p>Deportes</p>
                </li>
            </ul>
        </>
    );
}

export default Analitics;