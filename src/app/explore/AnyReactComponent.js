import Image from "next/image";
import React from 'react';

const AnyReactComponent = ({ text, icon, active, onClick }) => (
  <div
    style={{
      backgroundColor: "white",
      border: "1px solid",
      textAlign: "center",
      borderRadius: "10px",
      position: "relative",
      display: "inline-block",
      padding: active ? 8 : 4,
    }}
    onClick={onClick}
  >
    {active && (
      <p style={{ margin: "10px", fontSize: "18px", color: "black" }}>{text}</p>
    )}
    <div style={{ width: active ? 200 : 50, aspectRatio: 1, position: "relative" }}>
      <Image src={icon} alt={text} layout="fill" />
    </div>
  </div>
);

export default AnyReactComponent;
