import React from 'react';
import './styles.css';

const Coin = ({ x, y, onClick }) => {
  return (
    <div className="coin" style={{ left: x, top: y }} onClick={onClick}>
      $
    </div>
  );
};

export default Coin;
