import React from 'react';

const Controls = ({ currency, onBuyFish }) => {
  const fishCost = 100;
  return (
    <div className="controls">
      <h2>Currency: ${currency}</h2>
      <button onClick={onBuyFish} disabled={currency < fishCost}>
        Buy Fish (${fishCost})
      </button>
    </div>
  );
};

export default Controls;
