import React from 'react';
import './styles.css';

const Fish = ({ x, y }) => {
  return (
    <div className="fish" style={{ left: x, top: y }}>
      <div className="fish-body"></div>
      <div className="fish-tail"></div>
    </div>
  );
};

export default Fish;
