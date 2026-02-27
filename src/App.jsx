import { useState } from "react";
import { useGame } from "./hooks/useGame";

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

  function handleNumberClick(num) {
    if (status !== "playing") return;
    setInput((prev) => prev + num);
  }

  function handleClear() {
    setInput("");
  }

  function handleSubmit() {
    if (!input) return;
    submitAnswer(input);
    setInput("");
  }

  return (
    <div style={styles.container}>
      <h2>Little Professor</h2>

      {status !== "gameover" && (
        <>
          <div style={styles.problem}>
            {current.a} {current.operator} {current.b} = ?
          </div>

          <div style={styles.userInput}>{input || "_"}</div>

          {status === "showingAnswer" && (
            <div style={styles.correctAnswer}>
              Correct Answer: {current.answer}
            </div>
          )}

          {attempt === 1 && status === "playing" && (
            <div style={styles.retry}>Try again!</div>
          )}

          <div style={styles.keypad}>
            {[7,8,9,4,5,6,1,2,3].map((n) => (
              <button
                key={n}
                style={styles.keypadButton}
                onClick={() => handleNumberClick(n)}
              >
                {n}
              </button>
            ))}

            <button style={styles.keypadButton} onClick={handleClear}>
              C
            </button>

            <button
              style={styles.keypadButton}
              onClick={() => handleNumberClick(0)}
            >
              0
            </button>

            <button style={styles.keypadButton} onClick={handleSubmit}>
              OK
            </button>
          </div>

          <div style={styles.info}>
            Question: {questionNumber} / 10
          </div>
        </>
      )}

      {status === "gameover" && (
        <>
          <h3>Game Over</h3>
          <p>Score: {score} / 10</p>
          <button style={styles.keypadButton} onClick={resetGame}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "black",
    color: "#00ff00",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    textAlign: "center",
  },
  problem: {
    fontSize: "2.5rem",
    margin: "1rem",
  },
  userInput: {
    fontSize: "2rem",
    marginBottom: "1rem",
    minHeight: "40px",
  },
  correctAnswer: {
    color: "#ff4444",
    marginBottom: "1rem",
  },
  retry: {
    color: "#ffaa00",
    marginBottom: "1rem",
  },
  keypad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 70px)",
    gap: "10px",
  },
  keypadButton: {
    fontSize: "1.4rem",
    padding: "15px",
    backgroundColor: "#111",
    color: "#00ff00",
    border: "2px solid #00ff00",
    cursor: "pointer",
  },
  info: {
    marginTop: "1rem",
  },
};