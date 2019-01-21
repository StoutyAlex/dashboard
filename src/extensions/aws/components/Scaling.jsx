import React, { PropTypes, Component } from 'react'
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import ApiConsumer from '../../../mixin/apiMixin';
import _ from 'lodash';
import { ProgressBar } from 'react-bootstrap';

import '../../../styles/extensions/scaling.css'
import { relative } from 'path';

class Scaling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 3,
      maxSize: 10,
      minSize: 3,
    }
  }

  getApiRequest() {
    const { name } = this.props;
    return {
      id: `aws.scaling.${name}`,
      params: { name }
    }
  }

  onApiData(data){
    if (data) {
      const group = data.AutoScalingGroups[0];
      this.setState({
        current: group.Instances.length,
        minSize: group.MinSize,
        maxSize: group.MaxSize
      });
    }
  }

  render() {
    const { thresholds, title } = this.props;
    const { current, minSize, maxSize } = this.state;

    const cappedValue  = Math.min(current, _.max(thresholds.map(threshold => threshold.threshold)));
    let message = null;

    const normThresholds = thresholds.map(threshold => {
        if (message === null && cappedValue <= threshold.threshold) {
            message = threshold.message;
        }

        return {
            upperBound: threshold.threshold,
            color:      threshold.color
        };
    });

    const progressContainer = () => (
      <div className="scaling-progress-container">
        <div style={{marginBottom: '8px'}}>
          {message}
        </div>
        {/* Make this work properly */}
        <ProgressBar style={{backgroundColor: '#2d4052'}}>
          <ProgressBar striped bsStyle="success" now={60} key={1} />
          <ProgressBar striped bsStyle="warning" now={30} key={2} style={{opacity: "0.2"}}/>
          <ProgressBar active bsStyle="danger" now={10} key={3} style={{opacity: "0.2"}}/>
        </ProgressBar>
      </div>
    )

    return (
      <div className="scaling-container">
        <span>
          <div className="scaling-half" style={{position: 'relative'}}>
            <div style={{ fontSize: '1.5em'}}>
                Scaling Count
            </div>
            <div style={{ fontSize: '2em'}}>
                {title}
            </div>
            </div>
        </span>
        <span>
          <div className="scaling-half" style={{textAlign: 'center'}}>
            <div style={{ fontSize: '3.8em', color: 'rgba(255,255,255,0.5)'}}>
                {current}/10
            </div>
            </div>
        </span>
        <span>
          {progressContainer()}
        </span>
      </div>
  );
  }

}

reactMixin(Scaling.prototype, ListenerMixin);
reactMixin(Scaling.prototype, ApiConsumer);

Scaling.displayName = "Scaling";

Scaling.defaultProps = {
  name: PropTypes.string.isRequired,
  thresholds: PropTypes.arrayOf(PropTypes.shape({
    threshold: PropTypes.number.isRequired,
    color:     PropTypes.string.isRequired,
    message:   PropTypes.string.isRequired
  })).isRequired
};

Scaling.defaultProps = {
  thresholds: [
      { threshold: 6,  color: '#85e985', message: 'Strong and Stable' },
      { threshold: 8,  color: '#ecc265', message: 'Reaching Capacity' },
      { threshold: 10, color: '#f26a3f', message: "Its gonna blow!" }
  ]
};

export default Scaling;