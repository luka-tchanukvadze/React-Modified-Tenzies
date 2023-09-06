import "./App.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useState, useEffect } from "react";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [count, setCount] = useState([]);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState(
    JSON.parse(localStorage.getItem("bestTime") || null)
  );
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (tenzies) {
      const yourBestTime = localStorage.getItem("bestTime");
      if (!yourBestTime || timer < yourBestTime) {
        localStorage.setItem("bestTime", timer.toString());
        setBestTime(timer.toString());
      }
    }
  }, [tenzies, timer]);

  // useEffect(() => {
  //   const yourBestTime = localStorage.getItem("bestTime");
  //   if (tenzies) {
  //     if (!yourBestTime) {
  //       localStorage.setItem("bestTime", JSON.stringify(timer));
  //       setBestTime(timer);
  //     } else if (timer < parseInt(yourBestTime)) {
  //       localStorage.setItem("bestTime", JSON.stringify(timer));
  //       setBestTime(timer);
  //     }
  //   }
  // }, [tenzies, timer]);

  useEffect(() => {
    if (gameStarted && !tenzies) {
      let sec = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      return () => {
        clearInterval(sec);
      };
    }
  }, [gameStarted, tenzies]);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (gameStarted && allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice, gameStarted]);

  function startGame() {
    setGameStarted(true);
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function countRolls() {
    tenzies ? setCount([]) : setCount((prev) => [...prev, prev.length + 1]);
  }

  // function countTime() {
  //   tenzies && setTimer(0);
  // }

  function rollDice() {
    countRolls();
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setTimer(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button
        className="roll-dice"
        onClick={() => {
          rollDice();
          startGame();
        }}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>

      {tenzies && (
        <p>
          Rolls: {count.length}
          <br></br>
          Time: {timer}s<br></br>
          BestTime: {bestTime ? `${bestTime}s` : "N/A"}
        </p>
      )}
    </main>
  );
}

export default App;
