import React from 'react';
import './styles.css';

const Controls = ({ currency, fishCount, coinsEarned, onBuyFish }) => {
  const fishCost = 100;
  const foodCost = 1;
  const canBuyFish = currency >= fishCost;

  return (
    <div className="controls">
      <div className="controls-container">
        <div className="title">🐠 Insaniquarium 🐠</div>
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-label">Balance</div>
            <div className="stat-value">${currency}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Fish</div>
            <div className="stat-value">{fishCount}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Coins Earned</div>
            <div className="stat-value">${coinsEarned}</div>
          </div>
        </div>
        <div className="button-row">
          <button 
            className={`buy-button ${canBuyFish ? 'enabled' : 'disabled'}`}
            onClick={onBuyFish} 
            disabled={!canBuyFish}
          >
            🐠 Buy Fish (${fishCost})
          </button>
        </div>
        <div className="instructions">
          Click in the tank to drop food (${foodCost}/pellet)
        </div>
      </div>
    </div>
  );
};

export default Controls;
