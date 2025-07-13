import React, { use } from "react"
import { languages } from "./languages"
import clsx from "clsx";
import { getFarewellText } from "./utils";
import { words } from "./words";
import Confetti from 'react-confetti'


export default function AssemblyEndgame() {
const [time, setTime] = React.useState(120);

    const [currentWord, setCurrentWord] = React.useState(words[Math.floor(Math.random() * words.length)])
    // console.log(currentWord);
    const letterArray = currentWord.split("");
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const [userInput, setUserInput] = React.useState([]);
    const [farewellText, setFarewellText] = React.useState("");

    const wrongGuessCount = userInput.filter(letter => !letterArray.includes(letter)).length;
    let isLastGuessIncorrect;
    React.useEffect(() => {
        if (wrongGuessCount > 0 && languages[wrongGuessCount - 1]) {
            const farewell = getFarewellText(languages[wrongGuessCount - 1].name);
            setFarewellText(farewell);
            const timer = setTimeout(() => {
                setFarewellText("");
            }, 3000);

            return () => clearTimeout(timer);

        }
    }, [wrongGuessCount]);



    // console.log(wrongGuessCount);


    function addLetter(letter) {
        setUserInput((prevInput) =>
            prevInput.includes(letter) ? prevInput : [...prevInput, letter]
        )


    }
    function newGameClicked() {
        setCurrentWord(words[Math.floor(Math.random() * words.length)])
        setUserInput([])
    }
    const isGameWon = letterArray.every(letter => userInput.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1 ||time<=0;
    const isGameOver = isGameLost || isGameWon ;
    // console.log(isGameOver);
    // console.log(userInput)

    React.useEffect(()=>{
  let interval;
  if (!isGameOver){
    interval=setInterval(()=>{setTime(prev=>prev-1)},1000);
  }else{
    clearInterval(interval)
  }
  return ()=>clearInterval(interval)
},[isGameOver])

React.useEffect(() => {
  if (time < 0) {
    setTime(0); 
  }
}, [time]);

    const classMessage = clsx({
        "game-status": true,
        "game-won": isGameWon,
        "game-lost": isGameLost,
        "farewell": !isGameWon && !isGameLost && farewellText

    })

    return (
        <main>
            {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}

            <header>
                <div className="counter">
                    ⏱️ {time}s
                </div>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the programming world safe from Assembly</p>
            </header>

            <section aria-live="polite" className={classMessage}>
                {isGameOver ? (isGameWon ? (< ><h2>You Win!</h2>
                    <p>You have successfully guessed the word.🥂</p></>)
                    : (< ><h2>Game Over!</h2>
                        <p>You Lose! Better start learning Assembly😭</p></>))
                    : null}
                {!isGameWon && !isGameLost && farewellText && (
                    < >
                        <p>{farewellText}</p>
                    </>
                )}

            </section>

            <section className="language-list">
                {languages.map((language, index) => {
                    const isLanguageLost = index < wrongGuessCount;
                    const style = {
                        color: `${language.color}`,
                        backgroundColor: `${language.backgroundColor}`,
                    }
                    const className = clsx({
                        chip: true,
                        lost: isLanguageLost
                    })
                    return <span className={className}
                        style={style}
                        key={language.name}> {language.name}  </span>
                })}
            </section>

            <section className="word-display">

                {letterArray.map((letter, index) => {
                    const className = clsx({
                        letter: true,
                        hidden: !userInput.includes(letter) && !isGameLost,
                        red: isGameLost && !userInput.includes(letter),
                        green: isGameLost && userInput.includes(letter)
                    })
                    return <span className={className} key={index}>{letter.toUpperCase()}</span>
                })}
            </section>

            <section className="alphabet">
                {alphabet.map((letter) => {
                    const isGuessed = userInput.includes(letter);
                    const isCorrect = isGuessed && currentWord.includes(letter);
                    const isWrong = isGuessed && !currentWord.includes(letter);
                    const className = clsx({

                        correct: isCorrect,
                        wrong: isWrong
                    })
                    //   console.log(className)
                    return <button disabled={isGameLost || isGameWon} onClick={() => addLetter(letter)} className={className} key={letter}>{letter.toUpperCase()}</button>
                })}
            </section>
            {isGameOver && <button onClick={newGameClicked} className="new-game">New Game</button>}
            {!isGameOver && <p className="remaining">Remaining Guesses: {letterArray.length - wrongGuessCount + 1}</p>}
        </main>
    )
}
