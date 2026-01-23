import { useState } from 'react';

function DicePopup({ isOpen, onClose, onRoll }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState('');
  const [currentFace, setCurrentFace] = useState('⚀');

  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const handleRoll = () => {
    setRolling(true);
    setResult('');

    let counter = 0;
    const interval = 100;
    const duration = 1000;
    const maxRolls = duration / interval;

    const rollInterval = setInterval(() => {
      const randomFace = diceFaces[Math.floor(Math.random() * 6)];
      setCurrentFace(randomFace);
      counter++;

      if (counter >= maxRolls) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setCurrentFace(diceFaces[finalRoll - 1]);
        setResult(`Vous avez obtenu : ${finalRoll}`);
        setRolling(false);
        onRoll(finalRoll);
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
        <h2>Lancez le dé !</h2>
        <div className="dice-animation">
          <div className={`dice ${rolling ? 'rolling' : ''}`}>
            <div className="dice-face">{currentFace}</div>
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
