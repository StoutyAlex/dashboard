import React from 'react';

const PRCell = ({ count, name, max }) => {
  // change class name
  return (
    <span> 
      <div className="pullrequests__count--indiviual-cell" style={{width: `${Math.floor(100/max)}%`}}> 
        <div className="pullrequests__cell--name">
          {name.split('-')[1].toUpperCase()}
        </div>
        <div className="pullrequests__cell--count">
          {count}
        </div>
      </div>
    </span>
  );
}

export default PRCell;