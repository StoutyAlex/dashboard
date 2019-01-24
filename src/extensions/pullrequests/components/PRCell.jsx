import React from 'react';

const PRCell = ({ count, name, max }) => {
  // let user set custom ranges
  const prCellColor = () => {
    if (count === 2) return 'pullrequests__count--getonit';
    if (count >= 3) return 'pullrequests__count--urgent';
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