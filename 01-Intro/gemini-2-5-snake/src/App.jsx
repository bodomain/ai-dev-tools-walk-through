import React, { useState, useEffect, useCallback } from 'react';

// --- Constants ---
const BOARD_SIZE = 20;
const INITIAL_SNAKE_POSITION = [{ x: 10, y: 10 }];
const INITIAL_FOOD_POSITION = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED_MS = 200;

// --- Helper Functions ---
const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  };
};

// --- Main App Component ---
export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState(INITIAL_FOOD_POSITION);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [speed, setSpeed] = useState(GAME_SPEED_MS);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [topScores, setTopScores] = useState([]);

  // --- Game Reset ---
  const resetGame = () => {
    setSnake(INITIAL_SNAKE_POSITION);
    setFood(generateRandomPosition());
    setDirection(INITIAL_DIRECTION);
    setSpeed(GAME_SPEED_MS);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  // --- Keyboard Controls ---
  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ': // Spacebar to pause/resume
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [direction, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // --- Game Loop ---
  useEffect(() => {
    if (gameOver || isPaused) {
      return;
    }

    const gameInterval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Move snake head
        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // --- Collision Detection ---
        // Wall collision
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameOver(true);
            return prevSnake;
          }
        }

        newSnake.unshift(head);

        // --- Food Consumption ---
        if (head.x === food.x && head.y === food.y) {
          setScore(prevScore => prevScore + 10);
          setSpeed(prevSpeed => Math.max(50, prevSpeed - 5)); // Increase speed
          
          let newFoodPosition;
          // Ensure new food doesn't spawn on the snake
          do {
            newFoodPosition = generateRandomPosition();
          } while (newSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
          setFood(newFoodPosition);
        } else {
          newSnake.pop(); // Remove tail
        }
        
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food, speed, gameOver, isPaused]);

  // --- Scores API Integration ---
  const fetchTopScores = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/scores/');
      const data = await res.json();
      setTopScores(data.slice(0, 10));
    } catch (err) {
      console.error('fetching scores', err);
    }
  };

  useEffect(() => {
    fetchTopScores();
  }, []);

  // --- Render ---
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-center font-mono p-4">
      <h1 className="text-4xl font-bold mb-2 tracking-widest">SNAKE</h1>
      <div className="text-lg mb-4 text-gray-300">
        <span>SCORE: {score}</span>
      </div>
      {/* Top Scores */}
      <div className="mt-6 w-64">
        <h3 className="text-lg mb-2">Top Scores</h3>
        <ol className="text-left">
          {topScores.map((s) => (
            <li key={s.id} className="py-1 text-gray-300">
              <span className="mr-2">{s.name}</span>
              <span className="font-bold">{s.score}</span>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          width: 'calc(min(80vw, 80vh))',
          height: 'calc(min(80vw, 80vh))',
        }}
      >
  {gameOver && (
          <div
            className="flex flex-col items-center justify-center text-center bg-gray-900 bg-opacity-70"
            style={{ gridColumn: `1 / span ${BOARD_SIZE}`, gridRow: `1 / span ${BOARD_SIZE}`, zIndex: 10 }}
          >
            <h2 className="text-5xl font-extrabold text-gray-100">GAME OVER</h2>
            <p className="text-xl mt-2">Your Score: {score}</p>
            {/* Save score input */}
            <div className="mt-4 flex items-center gap-2 justify-center">
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter name"
                className="px-3 py-2 rounded bg-gray-700 text-gray-200"
              />
              <button
                onClick={async () => {
                  try {
                    await fetch('http://127.0.0.1:8000/api/scores/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: playerName || 'Player', score }),
                    });
                    setPlayerName('');
                    fetchTopScores();
                  } catch (err) {
                    console.error('saving score', err);
                  }
                }}
                className="px-4 py-2 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-200 focus:outline-none"
              >
                Save
              </button>
            </div>
            <button
              onClick={resetGame}
              className="mt-6 px-6 py-3 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300"
            >
              RESTART
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div
            className="flex flex-col items-center justify-center text-center bg-gray-900 bg-opacity-70"
            style={{ gridColumn: `1 / span ${BOARD_SIZE}`, gridRow: `1 / span ${BOARD_SIZE}`, zIndex: 10 }}
          >
            <h2 className="text-5xl font-extrabold text-gray-100">PAUSED</h2>
             <button
              onClick={() => setIsPaused(false)}
              className="mt-6 px-6 py-3 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300"
            >
              RESUME
            </button>
          </div>
        )}

        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`rounded-sm ${index === 0 ? 'bg-gray-200' : 'bg-gray-400'}`}
            style={{ gridColumn: segment.x + 1, gridRow: segment.y + 1 }}
          />
        ))}

        {/* Render Food */}
        <div
          className="bg-gray-300 rounded-full"
          style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }}
        />
      </div>
    <div className="mt-4 text-center text-gray-400 text-sm">
          <p>Use Arrow Keys to Move</p>
          <p>Press Spacebar to Pause/Resume</p>
      </div>
    </div>
  );
}

