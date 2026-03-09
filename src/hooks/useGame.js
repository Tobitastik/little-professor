import { useState, useEffect } from "react";

export function useGame({ difficulty }) {
  const TOTAL_QUESTIONS = 10;

  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("playing");
  const [current, setCurrent] = useState(generateProblem(difficulty));

  function generateProblem({ maxNumber, operators }) {
    let a = Math.floor(Math.random() * (maxNumber + 1));
    let b = Math.floor(Math.random() * (maxNumber + 1));
    const operator = operators[Math.floor(Math.random() * operators.length)];

    if (operator === "/") {
      b = b || 1; // replace 0 with 1
      a = a - (a % b); // make divisible
    }

    const answer = eval(`${a} ${operator} ${b}`);
    return { a, b, operator, answer };
  }

  function nextQuestion() {
    const next = questionNumber + 1;
    if (next > TOTAL_QUESTIONS) {
      setStatus("gameover");
      return;
    }
    setQuestionNumber(next);
    setAttempt(0);
    setCurrent(generateProblem(difficulty));
    setStatus("playing");
  }

  function submitAnswer(input) {
    if (status !== "playing") return;
    const numericInput = Number(input);

    if (numericInput === current.answer) {
      setScore((s) => s + 1);
      nextQuestion();
    } else {
      if (attempt === 0) setAttempt(1);
      else {
        setStatus("showingAnswer");
        setTimeout(nextQuestion, 1500);
      }
    }
  }

  function resetGame() {
    setQuestionNumber(1);
    setScore(0);
    setAttempt(0);
    setStatus("playing");
    setCurrent(generateProblem(difficulty));
  }

  // regenerate current problem when difficulty changes mid-game
  useEffect(() => {
    setCurrent(generateProblem(difficulty));
    setQuestionNumber(1);
    setScore(0);
    setAttempt(0);
    setStatus("playing");
  }, [difficulty]);

  return {
    current,
    questionNumber,
    score,
    attempt,
    status,
    submitAnswer,
    resetGame,
  };
}