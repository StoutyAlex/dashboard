import React, { Component, PropTypes } from 'react'
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import ApiConsumer from '../../../mixin/apiMixin';

import '../../../styles/extensions/ping.css';

class Ping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: 0,
      responseTime: -1,
    };
  }

  getApiRequest() {
    const { url } = this.props;
    return {
      id: `status.ping.${url}`,
      params: { url }
    };
  }

  onApiData(data) {
    this.setState(data);
  }

  render() {
    const { responseTime, statusCode } = this.state;
    const { title } = this.props;

    const getStatus = () => {
      if (statusCode === 200)
        return <i className="fa fa-check"></i>
      return <i className="fa fa-times"></i>
    }

    const statusColor = (statusCode === 200 ? 'good' : 'bad')

    return (
      <div className="ping-container">
        <span>
          <div className="ping-half" style={{position: 'relative'}}>
            <div className="ping--title">
              {title}
            </div>
            <div className="ping--response-time">
              {responseTime}ms
            </div>
          </div>
        </span>
        <span>
          <div className="ping-half">
            <div className={`ping--status-container ping--status-${statusColor}`}>
              {getStatus()}
            </div>
          </div>
        </span>
      </div>
    )
  }
};

reactMixin(Ping.prototype, ListenerMixin);
reactMixin(Ping.prototype, ApiConsumer);

Ping.displayName = 'ping';

Ping.propTypes = {

};

export default Ping;
