import React from 'react';
import './Item.css';

export default function Item(name: string, text: any) {
  return (
    <div className="stat-item">
      <h3>{name}:</h3> <p>{text}</p>
    </div>
  );
}
