import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loader/Loader.jsx';

const Card = ({ card, onClick }) => (
  <div style={styles.card} onClick={() => onClick(card)}>
    <img src={card.images.small} alt={card.name} style={styles.cardImage} />
    <p>{card.name}</p>
    <p>HP: {card.hp || 'N/A'}</p>
  </div>
);

export default function SinglePlayer() {
  const [cards, setCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);
  const [selectedPlayerCard, setSelectedPlayerCard] = useState(null);
  const [selectedComputerCard, setSelectedComputerCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');
  const [playerPoints, setPlayerPoints] = useState(0);
  const [computerPoints, setComputerPoints] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(5);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=250');
        const data = await response.json();

        // Shuffle the cards array
        const shuffledCards = data.data.sort(() => 0.5 - Math.random());

        // Select the first 16 cards (8 for the player, 8 for the computer)
        const selectedCards = shuffledCards.slice(0, 16);

        setPlayerCards(selectedCards.slice(0, 8));
        setComputerCards(selectedCards.slice(8, 16));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cards:', error);
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      determineWinner(selectedPlayerCard, selectedComputerCard);
    }
  }, [timer]);

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(id);
    }
  }, [timer]);

  const handleCardSelection = (card) => {
    if (selectedPlayerCard || gameOver) return;
    setSelectedPlayerCard(card);

    const randomCard = computerCards[Math.floor(Math.random() * computerCards.length)];
    setSelectedComputerCard(randomCard);

    setTimer(5);
    setShowOverlay(false);
  };

  const determineWinner = (playerCard, computerCard) => {
    if (!playerCard || !computerCard) return;

    const playerCardPoints = Number(playerCard.hp) || 0;
    const computerCardPoints = Number(computerCard.hp) || 0;

    let resultMessage;
    let overlayMessage;

    if (playerCardPoints > computerCardPoints) {
      resultMessage = 'You win this round!';
      overlayMessage = 'WIN';
      setPlayerPoints(prev => prev + 1);
    } else if (playerCardPoints < computerCardPoints) {
      resultMessage = 'Computer wins this round!';
      overlayMessage = 'LOSE';
      setComputerPoints(prev => prev + 1);
    } else {
      resultMessage = 'It\'s a tie!';
      overlayMessage = 'TIE';
    }

    setResult(resultMessage);
    setOverlayText(overlayMessage);
    setRoundsPlayed(prev => prev + 1);
    setShowOverlay(true);

    setTimeout(() => {
      setShowOverlay(false);
      if (roundsPlayed >= 2) {
        endGame();
      } else {
        if (playerCardPoints < computerCardPoints) {
          setPlayerCards(prev => prev.filter(card => card.id !== selectedPlayerCard.id));
        }
        setSelectedPlayerCard(null);
        setSelectedComputerCard(null);
      }
    }, 4000);
  };

  const endGame = async () => {
    setGameOver(true);

    let resultMessage;
    if (playerPoints > computerPoints) {
      resultMessage = 'You won the game!';
      setOverlayText('WIN');
    } else if (playerPoints < computerPoints) {
      resultMessage = 'Computer won the game!';
      setOverlayText('LOSE');
    } else {
      resultMessage = 'The game is a tie!';
      setOverlayText('TIE');
    }

    setResult(resultMessage);
    setShowOverlay(true);

    try {
      const response = await fetch(`https://pokemon-game-mern-backend-om.vercel.app/api/v1/game-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          id: localStorage.getItem('id'),
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem('id'),
          playerPoints,
          computerPoints,
          opponentName: 'Computer',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Game result saved successfully');
      } else {
        console.error('Error saving game result:', data.message);
      }
    } catch (error) {
      console.error('Error saving game result:', error);
    }

    setTimeout(() => navigate('/'), 4000);
  };

  return (
    <div style={styles.container}>
      {loading && <Loading />}
      {!loading && (
        <>
          <div style={styles.playground}>
            <div style={styles.side}>
              <h2>Your Cards</h2>
              <div style={styles.cardsContainer}>
                {playerCards.map(card => (
                  <Card
                    key={card.id}
                    card={card}
                    onClick={handleCardSelection}
                  />
                ))}
              </div>
            </div>
            <div style={styles.fightArea}>
              {selectedPlayerCard && selectedComputerCard && (
                <div style={styles.fightContainer}>
                  <h2>Fight!</h2>
                  <div style={styles.battleGround}>
                    <div style={styles.card}>
                      <Card card={selectedPlayerCard} />
                    </div>
                    <div style={styles.card}>
                      <Card card={selectedComputerCard} />
                    </div>
                  </div>
                  <p style={styles.timer}>Timer: {timer}s</p>
                </div>
              )}
              {result && (
                <div style={styles.resultContainer}>
                  <h2>{result}</h2>
                </div>
              )}
            </div>
            <div style={styles.side}>
              <h2>Computer's Cards</h2>
              <div style={styles.cardsContainer}>
                {gameOver && (
                  computerCards.map((card, index) => (
                    <Card key={index} card={card} />
                  ))
                )}
              </div>
            </div>
          </div>
          {gameOver && (
            <div style={styles.gameOverContainer}>
              <h2>{result}</h2>
              <p>Your Points: {playerPoints}</p>
              <p>Computer's Points: {computerPoints}</p>
            </div>
          )}
          {showOverlay && (
            <div style={styles.overlay}>
              <h2 style={styles.overlayText}>{overlayText}</h2>
            </div>
          )}
        </>
      )}
      <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.5em',
    color: '#333',
  },
  playground: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '20px',
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  side: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
  },
  fightArea: {
    flex: '2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
  },
  fightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  battleGround: {
    position: 'relative',
    backgroundImage: 'url("/Battlefield.png")', // Adjust path if needed
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '400px',
    margin: '20px 0',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    width: '150px',
    cursor: 'pointer',
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  cardImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  timer: {
    fontSize: '1.2em',
    marginTop: '10px',
    color: '#333',
  },
  resultContainer: {
    marginTop: '20px',
  },
  gameOverContainer: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  overlay: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '50px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  overlayText: {
    fontSize: '2em',
    color: '#fff',
  },
};



