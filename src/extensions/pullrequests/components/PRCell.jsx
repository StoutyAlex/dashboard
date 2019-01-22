import React from 'react';

const PRCell = ({ count, name, max }) => {
  // change class name

  const prCellColor = () => {
    if (count == 1) return 'pullrequests__count--getonit';
    if (count >= 2) return 'pullrequests__count--urgent';
    return "pullrequests__count--happy"
  };

  const cellColor = prCellColor();

  return (
    <span> 
      <div className="pullrequests__count--indiviual-cell" style={{width: `${Math.floor(100/max)}%`}}> 
        <div className={`pullrequests__cell--name ${cellColor}`}>
          {name.split('-')[1].toUpperCase()}
        </div>
        <div className={`pullrequests__cell--count ${cellColor}`}>
          {count}
        </div>
      </div>
    </span>
  );
}

export default PRCell;