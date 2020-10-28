import React, { Fragment, useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';
import M from 'materialize-css';
import questionsJson from '../questionsJson.json';
import { ScoreContext } from '../App';
import useSound from 'use-sound';
import guessSound from '../assets/sounds/button-guess.mp3';
import falseSound from '../assets/sounds/button-fail.mp3'

function QuestionCard({ q1="Damask", q2="Minsk", q3="Saratov", q4="Maribor", correct="Minsk", ...restProps }) {
    const [questions] = useState(questionsJson);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(questions[currentQuestionIndex].question);
    const [answer, setAnswer] = useState(questions[currentQuestionIndex].answer);
    const [hint, setHint] = useState(questions[currentQuestionIndex].hint)
    const [numberOfQuestions] = useState(questions.length);
    const { score, setScore } = useContext(ScoreContext);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [hints, setHints] = useState(3);
    const [fiftyFifty, setFiftyFifty] = useState(2);
    const [time, setTime] = useState(40);
    const [answersDisabled, setAnswersDisabled] = useState(false);
    const [nextDisabled, setNextDisabled] = useState(true);
    const [hintDisabled, setHintDisabled] = useState(false);
    const [fiftyFiftyDisabled, setFiftyFiftyDisabled] = useState(false);
    const [totalForScore, setTotalForScore] = useState(0);
    const history = useHistory();
    const timerSpan = useRef(null);
    let options = document.querySelectorAll('.question');
    const [soundGuess] = useSound(guessSound, { volume: 0.15 });
    const [soundFalse] = useSound(falseSound, { volume: 0.08 });
    let countdownInterval;

    function clockInterval() {
        setTime(40);
        setNextDisabled(true);
       window.countdownInterval = setInterval(() => {
             setTime((time) => {
               return time > 0 && time - 1;
                });
              if (timerSpan.current.innerHTML === '0' && currentQuestionIndex + 2 == numberOfQuestions) {
                endGame();
              }  else if (timerSpan.current.innerHTML === '0'){
                M.toast({ html: `Time's out`, classes: 'time-out', displayLength: 4000 })
                clearInterval(window.countdownInterval);
                setTotalForScore(prev => prev + 1);
                setAnswersDisabled(true);
                setNextDisabled(false);
                setFiftyFiftyDisabled(true);
                setHintDisabled(true);
              }
         }, 1000)
    };

    function nextQuestionButton() {
        fiftyFifty > 0 && setFiftyFiftyDisabled(false);
        setAnswersDisabled(false);
        setHint(questions[currentQuestionIndex + 1].hint)
        hints > 0 && setHintDisabled(false);
        options = document.querySelectorAll('.question');
        let loopingButtons = document.getElementsByClassName('question');

        for (let i = 0; i < loopingButtons.length; i++) {
            loopingButtons[i].classList.remove('correctAnswerButton');
            loopingButtons[i].classList.remove('wrongAnswerButton');
        }
       
        options.forEach(option => {
            option.style.visibility = 'visible';
           fiftyFifty > 0 && setFiftyFiftyDisabled(false);
           option.style.visibility = 'visible';
        });
        
        setAnswer(questions[currentQuestionIndex + 1].answer);
        setCurrentQuestionIndex(prevCurrentQuestionIndex => prevCurrentQuestionIndex + 1);
        setCurrentQuestion(questions[currentQuestionIndex + 1].question);
        clockInterval();
        }

        useEffect(() => {
            options = document.querySelectorAll('.question');
            setScore(0);
            clockInterval();
        },[]);

    function checkGuess(e) {
        setAnswersDisabled(true);
        setHintDisabled(true);
        setFiftyFiftyDisabled(true);
        setTotalForScore(prev => prev + 1);
        let hintDom = document.getElementsByClassName('hint-display')[0];

        if (hintDom !== undefined) {
            hintDom.classList = 'hidden';
        }
        if (e.target.textContent === answer) {
            e.target.classList.add('correctAnswerButton');
            setNextDisabled(false);
            soundGuess();
            M.toast({ html: 'Correct!', classes: "toastTrue", displayLength: 1500 });
            clearInterval(window.countdownInterval);
            setScore(prevScore => prevScore + 1);
            setTimeout(() => {
                setCorrectAnswers(prevCorrectAnswers => correctAnswers + 1);
            }, 1000);
            
        } else {
            e.target.classList.add('wrongAnswerButton');
            setNextDisabled(false);
            setAnswersDisabled(true);
            soundFalse();
            M.toast({ html: `False. - ${answer}`, classes: 'toastFalse', displayLength: 2300 });
            clearInterval(window.countdownInterval);
        }
        if ((currentQuestionIndex + 1) === numberOfQuestions) {
            endGame();
        }
    }

    function useFiftyFifty() {
        let indexOfAnswer = 0;
        setFiftyFiftyDisabled(true);
        setFiftyFifty(prevFiftyFifty => fiftyFifty - 1)
        options.forEach((option, index) => {
            if (option.innerHTML === answer) {
                indexOfAnswer = index;
            }
        });
        while (true) {
            const randomNumber = Math.round(Math.random() * 3);
            const randomNumber2 = Math.round(Math.random() * 3);
            if (randomNumber !== randomNumber2 && randomNumber !== indexOfAnswer && randomNumber2 !== indexOfAnswer) {
                options[randomNumber].style.visibility = 'hidden';
                options[randomNumber2].style.visibility = 'hidden';
                break;
            }
        }
    }

    function showHint() {
        setHintDisabled(true);
        let hintInterval = (time * 1000) - 1000;
        setHints(prevHints => prevHints -1);
      M.toast({ html: time > 0 ? hint : undefined, classes: 'hint-display', displayLength: hintInterval });
    }

    function endGame() {
        setNextDisabled(true);
        clearInterval(window.countdownInterval);
        setTimeout(() => {
            history.push('/end')
        }, 3000)
    }

    function quitButton() {
        setNextDisabled(true);
        clearInterval(window.countdownInterval);
        setTimeout(() => {
            history.push('/end')
        }, 1000)
    }

return (
    <Fragment> 
        <Helmet><title>Quiz Game</title></Helmet>
        <div className="questions-container">
            <div className="lifeline-container">
                <button className="fifty-fifty-button" onClick={useFiftyFifty} disabled={fiftyFiftyDisabled}>
                    <span className="lifeline">50/50</span> &nbsp; 
                    <span className="mdi mdi-circle-half-full mdi-22px lifeline-icon"></span>
                    <span className="lifeline">{fiftyFifty} left</span>
                </button>
                <span className="mdi mdi-clock-outline mdi-24px timer">&nbsp;<span id="timer-span" ref={timerSpan}>{time}</span></span>
                <a href="play#hint-anchor" style={{textDecoration: "none"}}> 
                <button className="hints-button" onClick={showHint} disabled={hintDisabled}>
                    <span className="lifeline">Get a hint &nbsp;</span>
                    <span className="mdi mdi-lightbulb-on-outline mdi-22px lifeline-icon"></span>
                    <span className="lifeline"><span>{hints} left</span></span>
                </button>
                </a>
            </div>
            <div className="currentQuestion-score-container">
                <p>{currentQuestionIndex + 1} of {numberOfQuestions}</p>
                <p>Correct answers: {score}/{totalForScore}</p>
            </div>
            <h4 id="current-question">{currentQuestion}</h4>
            <div className="choices-container">
                <div className="questions">
                    <a href="play#hint-anchor">  
                        <button className="question" 
                                onClick={(e) => {checkGuess(e)}} 
                                disabled={answersDisabled}>{questions[currentQuestionIndex].optionA}
                        </button>
                        <button className="question" 
                                onClick={(e) => {checkGuess(e)}} 
                                disabled={answersDisabled}>{questions[currentQuestionIndex].optionB}
                        </button>
                    </a>
                </div>
                <div className="questions">
                    <a href="play#hint-anchor">
                        <button className="question" 
                                onClick={(e) => {checkGuess(e)}} 
                                disabled={answersDisabled}>{questions[currentQuestionIndex].optionC}
                        </button>
                        <button className="question" 
                                onClick={(e) => {checkGuess(e)}} 
                                disabled={answersDisabled}>{questions[currentQuestionIndex].optionD}
                        </button>
                    </a>
                </div>
            </div>
            <div className="button-container" id="hint-anchor">
                <button onClick={quitButton}>Quit</button>
                <button onClick={() => nextQuestionButton()} disabled={nextDisabled}>Next</button>   
            </div>
        </div>
    </Fragment>
    )
}

export default QuestionCard