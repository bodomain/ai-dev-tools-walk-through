import React from 'react';
import './styles.css';

const Fish = ({ x, y, hunger = 50, color = '#ffb400', tailColor = '#ff8c00', size = 1 }) => {
  // Hunger affects opacity: well-fed is bright, hungry is darker
  const hungerPercent = hunger / 100;
  const opacity = 0.5 + hungerPercent * 0.5; // 0.5 to 1.0
  
  // Scale the fish based on size attribute
  const width = 50 * size;
  const height = 30 * size;
  const bodyWidth = 40 * size;
  const tailRight = -15 * size;
  const tailTop = 5 * size;
  const tailWidth = 20 * size;
  const tailHeight = 20 * size;

  return (
    <div className="fish" style={{ left: x, top: y, opacity, width, height }}>
      <div 
        className="fish-body" 
        style={{ 
          backgroundColor: color,
          width: bodyWidth,
          height: height,
        }}
      ></div>
      <div 
        className="fish-tail" 
        style={{ 
          backgroundColor: tailColor,
          right: tailRight,
          top: tailTop,
          width: tailWidth,
          height: tailHeight,
        }}
      ></div>
      {hunger > 60 && <div className="hunger-indicator"></div>}
    </div>
  );
};

export default Fish;
