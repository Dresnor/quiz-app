import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import useSound from 'use-sound'
import startSound from '../assets/sounds/button-start.mp3';


function Home() {
    const [play] = useSound(startSound,
        { volume: 0.15 });
    return (
        
        <Fragment>
            <Helmet><title>Quiz | Home</title></Helmet>
            <div id="home">
                <section className="section">
                <div className="menuContainer">
                    <div className="logoPlayContainer">
                        <span className="mdi mdi-tooltip-check-outline mainIcon"></span>
                        <h1>Quiz App</h1>
                    </div>
                    <div className="linksContainer">
                        <div className="registration-links-div"><Link to="/login" className="registration-links"><p>Login</p></Link></div>
                        <div className="registration-links-div"><Link to="/register" className="registration-links"><p>Register</p></Link></div>
                    </div>
                </div>
                <p className="instructions-one">You have 40 seconds for each question.</p>
                <p className="instructions-two">Use yellow buttons for help!</p>
                <Link to="/play">   
                <div className="playButtonContainer" onClick={play}>
                    <p>Play</p>
                </div>
                </Link>
                </section>
            </div>
            
        </Fragment>
    )
} 

export default Home