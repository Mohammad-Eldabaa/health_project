// Card.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

export default function Card({ title }) {
  return (
    <Link to="/firstaiddetails">
      <div className="card cursor-pointer hover:shadow-lg transition">{title}</div>
    </Link>
  );
}
