import React from 'react';
import Fish from './Fish';
import Food from './Food';
import Coin from './Coin';
import './styles.css';

const Tank = ({ 
  fishes = [], 
  foodPellets = [], 
  coins = [], 
  onDropFood, 
  onCollectCoin 
}) => {
  const handleTankClick = (e) => {
    // Avoid dropping food when clicking a coin or fish
    if (e.target.classList.contains('coin') || e.target.classList.contains('fish')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDropFood(x, y);
  };

  return (
    <div className="tank" onClick={handleTankClick}>
      {fishes.map(fish => (
        <Fish 
          key={fish.id} 
          x={fish.x} 
          y={fish.y} 
          hunger={fish.hunger}
          color={fish.color}
          tailColor={fish.tailColor}
          size={fish.size}
        />
      ))}
      {foodPellets.map(food => (
        <Food key={food.id} x={food.x} y={food.y} />
      ))}
      {coins.map(coin => (
        <Coin 
          key={coin.id} 
          x={coin.x} 
          y={coin.y} 
          onClick={() => onCollectCoin(coin.id)} 
        />
      ))}
    </div>
  );
};

export default Tank;



