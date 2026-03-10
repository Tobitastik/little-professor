import { useState, useRef, useEffect } from "react";
import { useGame } from "./hooks/useGame";
import "./App.css";
import Confetti from "./Confetti";

const LEVELS = {
  easy: { operators: ["+"], maxNumber: 10 },
  medium: { operators: ["+", "-"], maxNumber: 50 },
  hard: { operators: ["+", "-", "*"], maxNumber: 100 },
  extreme: { operators: ["+", "-", "*", "/"], maxNumber: 200 },
};

export default function App() {
  const [difficulty, setDifficulty] = useState("easy");

  const {
    current,
    questionNumber,
    score,
    attempt,
    status,
    submitAnswer,
    resetGame,
  } = useGame({ difficulty: LEVELS[difficulty] });

  const [input, setInput] = useState("");

  // Audio refs
  const clickSound = useRef(null);
  const shortEndSound = useRef(null);
  const longEndSound = useRef(null);

  // Unicorn animation
  const [pos, setPos] = useState(-40);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (status === "gameover") {
      if (score <= 9) playShortEndSound();
      else playLongEndSound();
    }
  }, [status, score]);

  useEffect(() => {
    if (status !== "gameover") return;
    const interval = setInterval(() => {
      setPos((prev) => {
        let next = prev + direction * 10;
        if (next > 40 || next < -40) setDirection((d) => -d);
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [status, direction]);

  function playClick() {
    clickSound.current?.play().catch(console.log);
  }
  function playShortEndSound() {
    shortEndSound.current?.play().catch(console.log);
  }
  function playLongEndSound() {
    longEndSound.current?.play().catch(console.log);
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
      {/* Audio */}
      <audio ref={clickSound} src="/little-professor/sounds/click.wav" preload="auto" />
      <audio ref={shortEndSound} src="/little-professor/sounds/shortfanfare.wav" preload="auto" />
      <audio ref={longEndSound} src="/little-professor/sounds/fanfare.wav" preload="auto" />

      <div className="game-box">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="keypad-button"
        >
          <option value="easy">Easy (+)</option>
          <option value="medium">Medium (+, -)</option>
          <option value="hard">Hard (+, -, *)</option>
          <option value="extreme">Extreme (+, -, *, /)</option>
        </select>
        <h2 className="title">Little Professor</h2>


        {status !== "gameover" && (
          <>
            <div className="problem">{current.a} {current.operator} {current.b} = ?</div>
            <div className="user-input">{input || "_"}</div>

            {status === "showingAnswer" && (
              <div className="correct-answer">Correct Answer: {current.answer}</div>
            )}

            {attempt === 1 && status === "playing" && (
              <div className="retry">Try again!</div>
            )}

            <div className="keypad">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((n) => (
                <button key={n} className="keypad-button" onClick={() => handleNumberClick(n)}>{n}</button>
              ))}           
              <button className="keypad-button" onClick={() => handleNumberClick("-")}>-</button>
              <button className="keypad-button" onClick={() => handleNumberClick(0)}>0</button>
              <button className="keypad-button" onClick={handleSubmit}>OK</button>
              <button className="keypad-button" onClick={handleClear}>C</button>              
            </div>

            <div className="info">Question: {questionNumber} / 10</div>
          </>
        )}

        {status === "gameover" && (
          <>
            {score === 10 && <Confetti count={100} />}
            <h3>Game Over</h3>
            <img
              src="/little-professor/images/unicorn.png"
              alt="Little Unicorn"
              className="unicorn"
              style={{ transform: `translateX(${pos}px) scaleX(${direction === 1 ? -1 : 1})` }}
            />
            <p>Score: {score} / 10</p>
            <button className="keypad-button" onClick={resetGame}>Play Again</button>
          </>
        )}
      </div>
    </div>
  );
}