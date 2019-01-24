import React, { PropTypes, Component } from 'react'
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import ApiConsumer from '../../../mixin/apiMixin';
import _ from 'lodash';
import { ProgressBar } from 'react-bootstrap';
// import Gauge from '../../../components/mozaik/charts/Gauge';

import '../../../styles/extensions/scaling.css'

class Scaling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      maxSize: 2,
      minSize: 1,
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
    const { title } = this.props;
    const { current, maxSize } = this.state;
    const totalPercent = (current / maxSize) * 100;

    const thresholds = [
      { threshold: 6,  color: '#85e985', message: 'Strong and Stable' },
      { threshold: 8,  color: '#ecc265', message: 'Reaching Capacity' },
      { threshold: 10, color: '#f26a3f', message: "Its gonna blow!" }
    ]

    const cappedValue  = Math.min(current, _.max(thresholds.map(threshold => threshold.threshold)));
    let message = null;


    thresholds.map(threshold => {
        if (message === null && cappedValue <= threshold.threshold) {
            message = threshold.message;
        }

        return {
            upperBound: threshold.threshold,
            color:      threshold.color
        };
    });

    const calculateSuccess = () => {
      if ( totalPercent >= 60 )
        return { percent: 60, remaining: 0 };
      if ( totalPercent < 60 ) 
        return {
          percent: totalPercent,
          remaining: (60 - totalPercent)
        };
    }

    const calculateWarning = () => {
      if ( totalPercent > 60 && totalPercent <= 90 )
        return { percent: (totalPercent - 60), remaining: (30 - (totalPercent - 60)) };
      if ( totalPercent > 90 )
        return { percent: 30, remaining: 0 }
      if ( totalPercent < 60 ) 
        return { percent: 0, remaining: 30 }
    }

    const calculateProgress = () => {
      const success = calculateSuccess();
      const warning = calculateWarning();

      return (
        <ProgressBar style={{backgroundColor: '#2d4052'}}>
          <ProgressBar striped bsStyle="success" now={success.percent} key={1} />
          <ProgressBar striped bsStyle="success" now={success.remaining} key={'remainingProgressSuccess'} style={{opacity: '0.2'}}/>
          <ProgressBar striped bsStyle="warning" now={warning.percent} key={2}/>
          <ProgressBar striped bsStyle="warning" now={warning.remaining} key={'remainingProgressWarning'} style={{opacity: '0.2'}}/>
          <ProgressBar  active bsStyle="danger" now={10} key={3} 
            style={{opacity: (totalPercent === 100 ? '1' : '0.2')}} />
        </ProgressBar>
      );
    };

    const progressContainer = () => (
      <div className="scaling-progress-container">
        <div style={{marginBottom: '8px'}}>
          {message}
        </div>
        {/* Make this work properly */}
        {calculateProgress()}
      </div>
    );

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
            <div style={{ fontSize: '3.3em', color: 'rgba(255,255,255,0.5)'}}>
                {current}/{maxSize}
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

export default Scaling;