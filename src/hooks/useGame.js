import { useState } from "react";

const TOTAL_QUESTIONS = 10;

function generateQuestion(max = 10) {
  const a = Math.floor(Math.random() * max);
  const b = Math.floor(Math.random() * max);

  return {
    a,
    b,
    operator: "+",
    answer: a + b,
  };
}

export function useGame() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("playing"); // playing | showingAnswer | gameover
  const [current, setCurrent] = useState(generateQuestion());
  const DIFFICULTY_SETTINGS = {
  easy: { max: 10, operators: ["+"] },
  medium: { max: 50, operators: ["+", "-"] },
  hard: { max: 100, operators: ["+", "-", "*"] },
  hardest: { max: 100, operators: ["+", "-", "*", "/"] },
  };

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
    setCurrent(generateQuestion());
    setStatus("playing");
  }

  function submitAnswer(input) {
    if (status !== "playing") return;

    const numericInput = Number(input);

    if (numericInput === current.answer) {
      setScore((s) => s + 1);
      nextQuestion();
    } else {
      if (attempt === 0) {
        setAttempt(1); // allow second try
      } else {
        setStatus("showingAnswer");

        setTimeout(() => {
          nextQuestion();
        }, 1500);
      }
    }
  }

  function resetGame() {
    setQuestionNumber(1);
    setScore(0);
    setAttempt(0);
    setStatus("playing");
    setCurrent(generateQuestion());
  }

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