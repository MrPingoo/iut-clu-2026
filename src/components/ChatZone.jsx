import { useEffect, useRef } from 'react';

function ChatZone({ messages, onValidate, onDiceClick, selectedCards = { location: [], character: [], weapon: [] } }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleValidate = () => {
    // Pour la validation d'une hypothèse, on prend le premier élément de chaque tableau
    const location = selectedCards.location[0];
    const character = selectedCards.character[0];
    const weapon = selectedCards.weapon[0];

    if (!location || !character || !weapon) {
      return;
    }

    onValidate(location, character, weapon);
  };

  return (
    <div className="chat-controls">
      <div className="chat-zone">
        <div className="chat-header">
          <h3>Messages</h3>
          <button className="dice-button" onClick={onDiceClick}>
            <span className="dice-icon">🎲</span>
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <p key={index} className={`chat-message ${message.type}`}>
              {message.text}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <div className="selected-cards-display">
            <div className="selected-category">
              <strong>Lieux:</strong> {selectedCards.location.length > 0 ? selectedCards.location.join(', ') : 'Aucun'}
            </div>
            <div className="selected-category">
              <strong>Personnages:</strong> {selectedCards.character.length > 0 ? selectedCards.character.join(', ') : 'Aucun'}
            </div>
            <div className="selected-category">
              <strong>Armes:</strong> {selectedCards.weapon.length > 0 ? selectedCards.weapon.join(', ') : 'Aucune'}
            </div>
          </div>

          <button
            className="validate-button"
            onClick={handleValidate}
            disabled={!selectedCards.location[0] || !selectedCards.character[0] || !selectedCards.weapon[0]}
          >
            Faire une hypothèse
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatZone;
