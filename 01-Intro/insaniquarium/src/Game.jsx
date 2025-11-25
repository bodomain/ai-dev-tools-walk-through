import React, { useState, useEffect, useRef } from 'react';
import Tank from './components/Tank';
import Controls from './components/Controls';

const TANK_WIDTH = 800;
const TANK_HEIGHT = 600;
const FISH_SPEED = 1.5;
const EATING_DISTANCE = 15;
const FISH_COST = 100;
const FOOD_COST = 1;
const COIN_VALUE = 10;

// Fish types with different characteristics
const FISH_TYPES = [
  { type: 'goldfish', color: '#ffb400', tailColor: '#ff8c00', size: 1, speed: 1, emoji: '🐠' },
  { type: 'bluefish', color: '#4169e1', tailColor: '#1e90ff', size: 0.8, speed: 1.3, emoji: '🐟' },
  { type: 'redfish', color: '#ff4500', tailColor: '#dc143c', size: 1.1, speed: 0.9, emoji: '🐠' },
  { type: 'greenfish', color: '#32cd32', tailColor: '#228b22', size: 0.9, speed: 1.2, emoji: '🐟' },
  { type: 'purplefish', color: '#da70d6', tailColor: '#ba55d3', size: 1.05, speed: 1.1, emoji: '🐠' },
  { type: 'orangefish', color: '#ff6347', tailColor: '#ff4500', size: 0.95, speed: 1.15, emoji: '🐟' },
];

const getRandomFishType = () => FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];

function Game() {
  const [fishes, setFishes] = useState([
    { id: 1, x: 50, y: 50, vx: 1, vy: 1, hunger: 50, ...getRandomFishType() },
  ]);
  const [foodPellets, setFoodPellets] = useState([]);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState(150);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const gameLoopRef = useRef();
  const stateRef = useRef({ fishes, foodPellets, coins });

  // Keep refs in sync with state
  useEffect(() => {
    stateRef.current = { fishes, foodPellets, coins };
  }, [fishes, foodPellets, coins]);

  const handleDropFood = (x, y) => {
    if (currency >= FOOD_COST) {
      setCurrency(c => c - FOOD_COST);
      const newFood = { id: Date.now(), x, y };
      setFoodPellets(prevFood => [...prevFood, newFood]);
    }
  };

  const handleBuyFish = () => {
    if (currency >= FISH_COST) {
      setCurrency(c => c - FISH_COST);
      const fishType = getRandomFishType();
      const newFish = {
        id: Date.now(),
        x: Math.random() * (TANK_WIDTH - 50),
        y: Math.random() * (TANK_HEIGHT - 30),
        vx: (Math.random() - 0.5) * 2 * FISH_SPEED * fishType.speed,
        vy: (Math.random() - 0.5) * 2 * FISH_SPEED * fishType.speed,
        hunger: 50,
        ...fishType,
      };
      setFishes(f => [...f, newFish]);
    }
  };

  const handleCollectCoin = (coinId) => {
    setCoins(currentCoins => currentCoins.filter(c => c.id !== coinId));
    setCurrency(c => c + COIN_VALUE);
    setCoinsEarned(c => c + COIN_VALUE);
  };

  const updateGame = () => {
    const now = Date.now();
    const { fishes: currentFishes, foodPellets: currentFood, coins: currentCoins } = stateRef.current;
    
    let eatenFoodIds = new Set();
    let newCoins = [];
    let updatedFishes = currentFishes.map(fish => {
      let newFish = { ...fish, hunger: Math.min(100, fish.hunger + 0.05) };

      let targetFood = null;
      if (newFish.hunger > 30) {
        let closestDist = Infinity;
        currentFood.forEach(food => {
          if (eatenFoodIds.has(food.id)) return;
          const dist = Math.hypot(newFish.x - food.x, newFish.y - food.y);
          if (dist < closestDist) {
            closestDist = dist;
            targetFood = food;
          }
        });

        if (targetFood) {
          const closestDist = Math.hypot(newFish.x - targetFood.x, newFish.y - targetFood.y);
          if (closestDist < EATING_DISTANCE) {
            newFish.hunger = 0;
            eatenFoodIds.add(targetFood.id);
            // Drop coins right after eating
            if (Math.random() < 0.8) {
              newCoins.push({ id: Date.now() + Math.random(), x: newFish.x, y: newFish.y, value: COIN_VALUE });
            }
          } else {
            const angle = Math.atan2(targetFood.y - newFish.y, targetFood.x - newFish.x);
            newFish.vx = Math.cos(angle) * FISH_SPEED * newFish.speed;
            newFish.vy = Math.sin(angle) * FISH_SPEED * newFish.speed;
          }
        }
      }

      if (!targetFood) {
        if (Math.random() < 0.01) {
          const angle = Math.random() * 2 * Math.PI;
          newFish.vx = Math.cos(angle) * FISH_SPEED * newFish.speed;
          newFish.vy = Math.sin(angle) * FISH_SPEED * newFish.speed;
        }
      }
      
      let newX = newFish.x + newFish.vx;
      let newY = newFish.y + newFish.vy;

      if (newX <= 0 || newX >= TANK_WIDTH - 50) {
        newFish.vx = -newFish.vx;
      }
      if (newY <= 0 || newY >= TANK_HEIGHT - 30) {
        newFish.vy = -newFish.vy;
      }
      
      newFish.x += newFish.vx;
      newFish.y += newFish.vy;
      
      return newFish;
    });

    // Update Food and Coins
    let updatedFood = currentFood
      .filter(p => !eatenFoodIds.has(p.id))
      .map(pellet => ({ ...pellet, y: pellet.y + 1 }))
      .filter(pellet => pellet.y < TANK_HEIGHT - 10);

    let updatedCoins = [...currentCoins, ...newCoins]
      .map(coin => ({ ...coin, y: coin.y + 0.5 }))
      .filter(coin => coin.y < TANK_HEIGHT - 30);

    setFishes(updatedFishes);
    setFoodPellets(updatedFood);
    setCoins(updatedCoins);

    gameLoopRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  return (
    <div className="Game">
      <Controls 
        currency={currency} 
        fishCount={fishes.length}
        coinsEarned={coinsEarned}
        onBuyFish={handleBuyFish} 
      />
      <Tank 
        fishes={fishes} 
        foodPellets={foodPellets} 
        coins={coins}
        onDropFood={handleDropFood}
        onCollectCoin={handleCollectCoin}
      />
    </div>
  );
}

export default Game;




