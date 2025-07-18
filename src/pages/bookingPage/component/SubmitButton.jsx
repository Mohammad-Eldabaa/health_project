import React, { useState } from "react";
export function SubmitButton() {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="submit"
      className="btn btn-lg px-5 py-2 text-white fw-bold"
      style={{
        backgroundColor: hover ? "#007C91" : "#0097A7",
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      احجز الموعد
    </button>
  );
}
