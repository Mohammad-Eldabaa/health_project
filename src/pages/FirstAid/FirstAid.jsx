import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import useFirstAidStore from "../../store/firstaid";

export default function FirstAid() {
  const { getAllStatusNames } = useFirstAidStore();
  const [cardTitles, setCardTitles] = useState([]);

  const getTitles = async () => {
    try {
      const titles = await getAllStatusNames();
      setCardTitles(titles || []);
      console.log(titles);
    } catch (err) {
      console.error("Error loading titles:", err);
      setCardTitles([]);
    }
  };

  useEffect(() => {
    getTitles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardTitles.map((title, index) => (
          <Card key={index} title={title.name || title} id={index + 1} />
        ))}
      </div>
    </div>
  );
}
