import React, { Component } from 'react';
import moment from 'moment';

const getCurrentTimeParts = () => {
  const currentTime = moment();
  return {
      time: currentTime.format('h:mm:ss'),
      ampm: currentTime.format('A'),
      date: currentTime.format('ddd Do MMM YYYY')
  };
};

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = getCurrentTimeParts();
  }

  componentDidMount() {
    setInterval(() => {
        this.setState(getCurrentTimeParts());
    }, 1000);
  }

  render() {
      return (
          <div>
          <br/>
              <div style={{fontSize: '3em'}}>
                  <span className="digitalclock__time">
                      {this.state.time + ' '}
                  </span>
                  <span className="digitalclock__date">
                      {this.state.ampm}
                  </span>
              </div>
              <br/>
              <div className="digitalclock__date" style={{fontSize: '2em'}}>
                  {this.state.date}
              </div>
          </div>
      );
  }
}

export default Clock;
