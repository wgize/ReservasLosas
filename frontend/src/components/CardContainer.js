import React from "react";

export default function CardContainer({ title, children }) {
  return (
    <div className="card-wrapper">
      <div className="card auth-card">
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
