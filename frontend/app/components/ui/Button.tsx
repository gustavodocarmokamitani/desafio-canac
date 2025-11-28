import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ children, ...props }: ButtonProps) {
  const isDisabled = props.disabled;
  return (
    <button
      {...props}
      style={{
        display: "flex",
        gap: "8px",
        padding: "10px 25px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#34b45f",
        border: "none",
        borderRadius: "15px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "background-color 0.3s ease",
      }}
    >
      {children}
    </button>
  );
}
