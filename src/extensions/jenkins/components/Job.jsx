import React, { Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import ApiConsumer from '../../../mixin/apiMixin';
import moment from 'moment';
import { ProgressBar } from 'react-bootstrap';

import '../../../styles/extensions/jenkins.css';

import image from '../../../assets/jenkins_bader.png';

const JENKINS_BUILD_STATUS_BUILDING = 'BUILDING';
const JENKINS_BUILD_STATUS_UNKNOWN  = 'UNKNOWN';

class Job extends Component {
  constructor(props) {
    super(props);
    this.state = { previousBuild: {}, currentBuild: {} };
  }

  getApiRequest() {
    const { job, title } = this.props;
    return {
      id: `jenkins.job.${job}`,
      params: { job }
    }
  }

  onApiData(builds) {
    const [currentBuild = {}, previousBuild = {}] = builds;
    this.setState({ currentBuild, previousBuild });
  }

  render() {
    const { currentBuild, previousBuild } = this.state;
    const { jobName } = this.props;

    const getBuildStatus = (build) => {
      if (build.result) {
          return build.result;
      }
      return build.building ? JENKINS_BUILD_STATUS_BUILDING : JENKINS_BUILD_STATUS_UNKNOWN;
    };

    const currentStatus = getBuildStatus(currentBuild);
    const previousStatus = getBuildStatus(previousBuild);

    const progress = currentBuild.building ?
      ((Date.now() - currentBuild.timestamp) / currentBuild.estimatedDuration) * 100 : 100;

    const jobStatus = () => (currentBuild.building ? previousStatus : currentStatus).toLowerCase();

    return (
      <div className={`jenkins__job--status--${jobStatus()}`}>
        <div className="jenkins__job--status-container">
          <span>
            <div className="jenkins__job--status-current">
              <div className="jenkins__job--build-number">
                Build #{currentBuild.number}<br />
                <div className="jenkins__job--name">
                  {jobName}&nbsp;<br />
                </div>
              </div>
              <div>
                <time className="jenkins__job--time-elapsed">
                  <i className="fa fa-clock-o"/>&nbsp;
                  {moment(currentBuild.timestamp, 'x').fromNow()}
                </time>
              </div>
            </div>
          </span>
          <span>
            <div className="jenkins__job--status-image">
              <img src={image} height='90px'></img>
            </div>
          </span>
        </div>
        <div className="jenkins__job--status-progress">
          { progress < 100 && 
            <div>
              &nbsp;
              <ProgressBar striped bsStyle="success" now={progress} key={1} className="jenkins__job--status-progress--background" />
            </div>
          }
        </div>
      </div>
    );
  }
};

Job.displayName = "Job";

Job.PropTypes = {
  url: PropTypes.string.isRequired,
  job: PropTypes.string.isRequired,
}

reactMixin(Job.prototype, ListenerMixin);
reactMixin(Job.prototype, ApiConsumer);

export default Job;