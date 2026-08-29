import React from 'react';

export default function Card({ title, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {title && <h2 className="mb-3 text-lg font-bold text-gray-900">{title}</h2>}
      {children}
    </section>
  );
}
