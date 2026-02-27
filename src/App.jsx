import { useState, useRef } from "react";
import { useGame } from "./hooks/useGame";
import "./App.css";

export default function App() {
  const {
    current,
    questionNumber,
    score,
    attempt,
    status,
    submitAnswer,
    resetGame,
  } = useGame();

  const [input, setInput] = useState("");

  // Ref for audio element
  const clickSound = useRef(null);

  function playClick() {
    if (clickSound.current) {
      clickSound.current.currentTime = 0; // rewind
      clickSound.current.play();
    }
  }

  function handleNumberClick(num) {
    if (status !== "playing") return;
    setInput((prev) => prev + num);
    playClick();
  }

  function handleClear() {
    setInput("");
    playClick();
  }

  function handleSubmit() {
    if (!input) return;
    submitAnswer(input);
    setInput("");
    playClick();
  }

  return (
    <div className="app-container">
      <audio ref={clickSound} public="/sounds/click.mp3" preload="auto" />
      <div className="game-box">
        <h2 className="title">Little Professor</h2>

        {status !== "gameover" && (
          <>
            <div className="problem">
              {current.a} {current.operator} {current.b} = ?
            </div>

            <div className="user-input">{input || "_"}</div>

            {status === "showingAnswer" && (
              <div className="correct-answer">
                Correct Answer: {current.answer}
              </div>
            )}

            {attempt === 1 && status === "playing" && (
              <div className="retry">Try again!</div>
            )}

            <div className="keypad">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  className="keypad-button"
                  onClick={() => handleNumberClick(n)}
                >
                  {n}
                </button>
              ))}

              <button className="keypad-button" onClick={handleClear}>
                C
              </button>

              <button
                className="keypad-button"
                onClick={() => handleNumberClick(0)}
              >
                0
              </button>

              <button className="keypad-button" onClick={handleSubmit}>
                OK
              </button>
            </div>

            <div className="info">
              Question: {questionNumber} / 10
            </div>
          </>
        )}

        {status === "gameover" && (
          <>
            <h3>Game Over</h3>
            <p>Score: {score} / 10</p>
            <button className="keypad-button" onClick={resetGame}>
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}