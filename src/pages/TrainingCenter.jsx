import React, { useState, useEffect } from 'react';
import Loading from '../components/Loader/Loader.jsx';

const Card = ({ card, onClick, isDisabled }) => (
  <div
    style={{
      ...styles.card,
      opacity: isDisabled ? 0.5 : 1,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
    }}
    onClick={() => !isDisabled && onClick(card)}
  >
    <img src={card.images.small} alt={card.name} style={styles.cardImage} />
    <p>{card.name}</p>
    <p>HP: {card.hp || 'N/A'}</p>
  </div>
);

export default function TrainingCenter() {
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

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=250');
        const data = await response.json();

        const shuffledCards = data.data.sort(() => 0.5 - Math.random());
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

  const handleCardSelection = (card) => {
    if (selectedPlayerCard || gameOver) return;
    setSelectedPlayerCard(card);

    const randomCard = computerCards[Math.floor(Math.random() * computerCards.length)];
    setSelectedComputerCard(randomCard);

    setTimeout(() => determineWinner(card, randomCard), 1000);
  };

  const determineWinner = (playerCard, computerCard) => {
    const playerCardPoints = Number(playerCard.hp) || 0;
    const computerCardPoints = Number(computerCard.hp) || 0;

    let resultMessage;

    if (playerCardPoints > computerCardPoints) {
      resultMessage = 'You win this round!';
      setPlayerPoints((prev) => prev + 1);
    } else if (playerCardPoints < computerCardPoints) {
      resultMessage = 'Computer wins this round!';
      setComputerPoints((prev) => prev + 1);
    } else {
      resultMessage = 'It\'s a tie!';
    }

    setResult(resultMessage);
    setRoundsPlayed((prev) => prev + 1);

    setTimeout(() => {
      setSelectedPlayerCard(null);
      setSelectedComputerCard(null);
      setResult('');

      if (roundsPlayed >= 7) {
        setGameOver(true);
        setTimeout(() => resetGame(), 3000);
      }
    }, 2000);
  };

  const resetGame = () => {
    setPlayerPoints(0);
    setComputerPoints(0);
    setRoundsPlayed(0);
    setGameOver(false);
    setSelectedPlayerCard(null);
    setSelectedComputerCard(null);

    const shuffledCards = cards.sort(() => 0.5 - Math.random());
    const selectedCards = shuffledCards.slice(0, 16);
    setPlayerCards(selectedCards.slice(0, 8));
    setComputerCards(selectedCards.slice(8, 16));
  };

  return (
    <div style={styles.container}>
      {loading && <Loading />}
      {!loading && (
        <>
          <h1 style={styles.title}>Training Center</h1>
          <p style={styles.subtitle}>Practice your tactics and improve your game!</p>

          <div style={styles.howToPlay}>
            <h2 style={styles.howToPlayTitle}>How to Play</h2>
            <div style={styles.howToPlaySteps}>
              <div style={styles.step}>
                <p><strong>1. Setup:</strong> Start by selecting your cards from the deck. You and the computer will each get a set of cards.</p>
                <img src="/HowToPlay/1.png" alt="Initial Setup" style={styles.stepImage} />
              </div>
              <div style={styles.step}>
                <p><strong>2. Selecting Cards:</strong> Choose a card from your hand to play. The computer will randomly select a card.</p>
                <img src="/HowToPlay/2.png" alt="Selecting Cards" style={styles.stepImage} />
              </div>
              <div style={styles.step}>
                <p><strong>3. Playing a Round:</strong> Both you and the computer will reveal your chosen cards. The card with the higher HP wins the round.</p>
                <img src="/HowToPlay/3.png" alt="Playing a Round" style={styles.stepImage} />
              </div>
              <div style={styles.step}>
                <p><strong>4. Determining the Winner:</strong> If your card has higher HP than the computer's card, you win the round. Points are awarded based on the outcome.</p>
                <img src="/HowToPlay/4.png" alt="Determining Winner" style={styles.stepImage} />
              </div>
              <div style={styles.step}>
                <p><strong>5. Ending the Game:</strong> The game ends after 8 rounds. The player with the most points wins.</p>
                <img src="/HowToPlay/5.png" alt="Game Over" style={styles.stepImage} />
              </div>
              <div style={styles.step}>
                <p><strong>6. Tips and Tricks:</strong> Pay attention to the HP values and try to select cards with higher HP to increase your chances of winning.</p>
                <img src="/HowToPlay/6.png" alt="Tips and Tricks" style={styles.stepImage} />
              </div>
            </div>
          </div>

          <div style={styles.playground}>
            <div style={styles.side}>
              <h2>Your Cards</h2>
              <div style={styles.cardsContainer}>
                {playerCards.map((card, index) => (
                  <Card
                    key={index}
                    card={card}
                    onClick={handleCardSelection}
                    isDisabled={selectedPlayerCard || gameOver}
                  />
                ))}
              </div>
            </div>
            <div style={styles.fightArea}>
              {selectedPlayerCard && selectedComputerCard && (
                <div style={styles.fightContainer}>
                  <h2>Fight!</h2>
                  <div style={styles.battleGround}>
                    <Card card={selectedPlayerCard} isDisabled />
                    <Card card={selectedComputerCard} isDisabled />
                  </div>
                  <p style={styles.result}>{result}</p>
                </div>
              )}
            </div>
            <div style={styles.side}>
              <h2>Computer's Cards</h2>
              <div style={styles.cardsContainer}>
                {gameOver && (
                  computerCards.map((card, index) => (
                    <Card key={index} card={card} isDisabled />
                  ))
                )}
              </div>
            </div>
          </div>
          {gameOver && (
            <div style={styles.gameOverContainer}>
              <h2>Game Over!</h2>
              <p>Your Points: {playerPoints}</p>
              <p>Computer's Points: {computerPoints}</p>
              <button onClick={resetGame} style={styles.resetButton}>
                Play Again
              </button>
              <div className="embedded-links">
        <p>Created by <a href="https://github.com/omavcher" target="_blank" rel="noopener noreferrer">Om Avcher</a></p>
        <p><a href="https://www.linkedin.com/in/omawchar/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
      </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
    container: {
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
    },
    title: {
      fontSize: '2.5em',
      color: '#333',
      margin: '20px 0',
    },
    subtitle: {
      fontSize: '1.2em',
      color: '#666',
      marginBottom: '20px',
    },
    howToPlay: {
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      textAlign: 'left',
      maxWidth: '1000px',  // Adjust based on your layout needs
    },
    howToPlayTitle: {
      fontSize: '2em',
      color: '#d84303',
      marginBottom: '10px',
    },
    howToPlaySteps: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    step: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '10px',
    },
    stepImage: {
      width: '100px',
      height: 'auto',
      borderRadius: '5px',
    },
    playground: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '20px 0',
    },
    side: {
      flex: '1',
      padding: '10px',
    },
    cardsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
    },
    fightArea: {
      flex: '2',
      padding: '10px',
    },
    fightContainer: {
      textAlign: 'center',
    },
    battleGround: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '10px',
    },
    result: {
      fontSize: '1.2em',
      color: '#d84303',
      marginTop: '10px',
    },
    gameOverContainer: {
      textAlign: 'center',
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    resetButton: {
      padding: '10px 20px',
      fontSize: '1em',
      backgroundColor: '#d84303',
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
};

