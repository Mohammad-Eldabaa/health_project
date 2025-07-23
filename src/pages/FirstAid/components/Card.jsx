// Card.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import useFirstAidStore from "../../../store/firstaid";

export default function Card({ title, id }) {
  const { setLastId } = useFirstAidStore();

  return (
    <Link to="/firstaiddetails">
      <div
        className="card cursor-pointer hover:shadow-lg transition"
        onClick={() => {
          setLastId(id);
        }}
      >
        {title}
      </div>
    </Link>
  );
}
