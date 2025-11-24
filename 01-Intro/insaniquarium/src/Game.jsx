import React, { useState, useEffect, useRef } from 'react';
import Tank from './components/Tank';
import Controls from './components/Controls';

const TANK_WIDTH = 800;
const TANK_HEIGHT = 600;
const FISH_SPEED = 1.5;
const EATING_DISTANCE = 15;
const FISH_COST = 100;
const COIN_VALUE = 10;

function Game() {
  const [fishes, setFishes] = useState([
    { id: 1, x: 50, y: 50, vx: 1, vy: 1, hunger: 50, lastDrop: 0 },
  ]);
  const [foodPellets, setFoodPellets] = useState([]);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState(150);
  const gameLoopRef = useRef();

  const handleDropFood = (x, y) => {
    const newFood = { id: Date.now(), x, y };
    setFoodPellets(prevFood => [...prevFood, newFood]);
  };

  const handleBuyFish = () => {
    if (currency >= FISH_COST) {
      setCurrency(c => c - FISH_COST);
      const newFish = {
        id: Date.now(),
        x: Math.random() * (TANK_WIDTH - 50),
        y: Math.random() * (TANK_HEIGHT - 30),
        vx: (Math.random() - 0.5) * 2 * FISH_SPEED,
        vy: (Math.random() - 0.5) * 2 * FISH_SPEED,
        hunger: 50,
        lastDrop: Date.now(),
      };
      setFishes(f => [...f, newFish]);
    }
  };

  const handleCollectCoin = (coinId) => {
    setCoins(currentCoins => currentCoins.filter(c => c.id !== coinId));
    setCurrency(c => c + COIN_VALUE);
  };

  const updateGame = () => {
    const now = Date.now();
    let eatenFoodIds = new Set();
    let newCoins = [];

    // Update Fish
    setFishes(currentFishes => currentFishes.map(fish => {
      let newFish = { ...fish, hunger: fish.hunger + 0.05 };

      // Drop coins if well-fed
      if (newFish.hunger < 20 && now - newFish.lastDrop > 5000) {
        if (Math.random() < 0.2) {
          newCoins.push({ id: Date.now() + Math.random(), x: newFish.x, y: newFish.y, value: COIN_VALUE });
          newFish.lastDrop = now;
        }
      }

      let targetFood = null;
      if (newFish.hunger > 30) {
        let closestDist = Infinity;
        foodPellets.forEach(food => {
          if (eatenFoodIds.has(food.id)) return;
          const dist = Math.hypot(newFish.x - food.x, newFish.y - food.y);
          if (dist < closestDist) {
            closestDist = dist;
            targetFood = food;
          }
        });

        if (targetFood) {
          if (closestDist < EATING_DISTANCE) {
            newFish.hunger = 0;
            eatenFoodIds.add(targetFood.id);
          } else {
            const angle = Math.atan2(targetFood.y - newFish.y, targetFood.x - newFish.x);
            newFish.vx = Math.cos(angle) * FISH_SPEED;
            newFish.vy = Math.sin(angle) * FISH_SPEED;
          }
        }
      }

      if (!targetFood) {
        if (Math.random() < 0.01) {
          const angle = Math.random() * 2 * Math.PI;
          newFish.vx = Math.cos(angle) * FISH_SPEED;
          newFish.vy = Math.sin(angle) * FISH_SPEED;
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
    }));

    // Update Food and Coins
    if (eatenFoodIds.size > 0) {
        setFoodPellets(pellets => pellets.filter(p => !eatenFoodIds.has(p.id)));
    }
    setFoodPellets(pellets =>
        pellets
            .map(pellet => ({ ...pellet, y: pellet.y + 1 }))
            .filter(pellet => pellet.y < TANK_HEIGHT - 10)
    );
    if (newCoins.length > 0) {
        setCoins(currentCoins => [...currentCoins, ...newCoins]);
    }
    setCoins(currentCoins =>
        currentCoins
            .map(coin => ({ ...coin, y: coin.y + 0.5 }))
            .filter(coin => coin.y < TANK_HEIGHT - 30)
    );

    gameLoopRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  return (
    <div className="Game">
      <Controls currency={currency} onBuyFish={handleBuyFish} />
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




