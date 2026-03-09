import React, { useEffect, useState } from "react";

export default function Confetti({ count = 50 }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const newConfetti = Array.from({ length: count }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100, // horizontal position in %
      animationDuration: 2 + Math.random() * 3 + "s", // 2–5 seconds
      size: 5 + Math.random() * 10 + "px",
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    }));
    setConfetti(newConfetti);
  }, [count]);

  return (
    <div className="confetti-wrapper">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animationDuration: c.animationDuration,
          }}
        />
      ))}
    </div>
  );
}