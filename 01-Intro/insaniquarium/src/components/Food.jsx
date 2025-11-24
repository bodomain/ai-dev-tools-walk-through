import React from 'react';
import './styles.css';

const Food = ({ x, y }) => {
  return (
    <div className="food" style={{ left: x, top: y }}></div>
  );
};

export default Food;
