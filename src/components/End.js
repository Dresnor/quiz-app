import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { ScoreContext } from '../App';


function End() {
    const { score } = useContext(ScoreContext);
    
    function resultText() {
         switch(true) {
             case score < 6: return <div><p className="score-paragraph">{score} out of 16</p><br />
             <p className="score-paragraph">"Outrageous, Egregious, Proposterous!"</p></div>;
            break;
             case score > 5 && score < 9: return <div><p className="score-paragraph">{score} out of 16</p><br />
             <p className="score-paragraph">"Not great at all. Somewhere in range of George's IQ test."</p></div>;
             break;
             case score > 8 && score < 15: return <div><p className="score-paragraph">{score} out of 16</p><br />
             <p className="score-paragraph">We have a Seinfeld fan here! Nice result, but another binge wouldn't hurt you.</p></div>;
             break;
             case score > 14: return <div><p className="score-paragraph">{score} out of 16</p><br />
             <p className="score-paragraph">"Congratulations. You may consider yourself as a master of domain."</p></div>;
             break;
         }
    }

    return(
        <Fragment>
            <Helmet><title>Quiz | Result</title></Helmet>
            <div id="home">
                <section className="section">
                <div className="menuContainer">
                    <div className="logoPlayContainer">
                        <span className="mdi mdi-tooltip-check-outline mainIcon"></span>
                        <h1 id="h1-quiz-app">Quiz App</h1>
                    </div>
                </div>
                <div className="end-result">
                    {resultText()}
                </div>
                <Link to="/" style={{ textDecoration: "none" }}>   
                <div className="home-link">
                    <p>Home</p>
                </div>
                </Link>
                </section>
            </div>
        </Fragment>
    )
}

export default End