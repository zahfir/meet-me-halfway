import React from "react";

interface SpinnerProps {
  color?: string;
  width?: string;
  height?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  color = "",
  width = "",
  height = "",
}) => {
  return (
    <div
      className={`spinner-border ${color ? "" : "text-light"}`}
      style={{ color: color, borderWidth: "0.15rem", width, height }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
