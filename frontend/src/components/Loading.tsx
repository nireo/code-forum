import React from "react";
import "./styles.css";

const Loading: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }}
      className="loader"
    ></div>
  );
};

export default Loading;
