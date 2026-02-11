import { useState } from 'react';

function DicePopup({ isOpen, onClose, onRoll }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState('');
  const [dice1Face, setDice1Face] = useState('⚀');
  const [dice2Face, setDice2Face] = useState('⚀');

  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const handleRoll = () => {
    setRolling(true);
    setResult('');

    let counter = 0;
    const interval = 100;
    const duration = 1500; // Durée un peu plus longue pour l'effet
    const maxRolls = duration / interval;

    const rollInterval = setInterval(() => {
      // Animer les deux dés indépendamment
      const randomFace1 = diceFaces[Math.floor(Math.random() * 6)];
      const randomFace2 = diceFaces[Math.floor(Math.random() * 6)];
      setDice1Face(randomFace1);
      setDice2Face(randomFace2);
      counter++;

      if (counter >= maxRolls) {
        clearInterval(rollInterval);

        // Résultats finaux des deux dés
        const finalRoll1 = Math.floor(Math.random() * 6) + 1;
        const finalRoll2 = Math.floor(Math.random() * 6) + 1;
        const total = finalRoll1 + finalRoll2;

        setDice1Face(diceFaces[finalRoll1 - 1]);
        setDice2Face(diceFaces[finalRoll2 - 1]);
        setResult(`🎲 ${finalRoll1} + ${finalRoll2} = ${total}`);
        setRolling(false);

        // Retourner la somme des deux dés
        onRoll(total);
      }
    }, interval);
  };

  if (!isOpen) return null;

  return (
    <div className="dice-popup active" onClick={onClose}>
      <div className="dice-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Lancez les dés !</h2>
        <div className="dice-animation">
          <div className={`dice ${rolling ? 'rolling' : ''}`}>
            <div className="dice-face">{dice1Face}</div>
          </div>
          <div className={`dice ${rolling ? 'rolling' : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className="dice-face">{dice2Face}</div>
          </div>
        </div>
        <button
          className="roll-button"
          onClick={handleRoll}
          disabled={rolling}
        >
          Lancer
        </button>
        <p className="dice-result">{result}</p>
      </div>
    </div>
  );
}

export default DicePopup;
