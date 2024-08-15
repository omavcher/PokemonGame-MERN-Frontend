import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch a single page of cards as an example
    axios.get('https://api.pokemontcg.io/v2/cards', {
      params: {
        pageSize: 10,
        page: 1,
        q: 'subtypes:mega',
        orderBy: '-set.releaseDate'
      }
    })
    .then(response => {
      setCards(response.data.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to fetch cards.');
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!cards.length) return <p>No cards available.</p>;

  return (
    <div  className="card-list">
      {cards.map(card => (
        <div key={card.id} className="card">
          <h3>{card.name}</h3>
          <img  src={card.images.small} alt={card.name} />
          <p><strong>Supertype:</strong> {card.supertype}</p>
          <p><strong>Subtypes:</strong> {card.subtypes.join(', ')}</p>
          <p><strong>HP:</strong> {card.hp}</p>
          <p><strong>Types:</strong> {card.types.join(', ')}</p>
          <p><strong>Rarity:</strong> {card.rarity}</p>
          <p><strong>Artist:</strong> {card.artist}</p>
          <p><strong>Set:</strong> {card.set.name} (Release Date: {card.set.releaseDate})</p>
          <p><strong>Number:</strong> {card.number}</p>
        </div>
      ))}
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
};

export default CardList;
