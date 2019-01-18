import React, { Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import ApiConsumer from '../../../mixin/apiMixin';
import moment from 'moment';

import '../../../styles/extensions/jenkins.css';

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

    const progressStyle = {
        border:          '1px solid #fff',
        width:           `${progress}%`,
    };

    const jobStatus = () => (currentBuild.building ? previousStatus : currentStatus).toLowerCase();

    return (
      <div className={`jenkins__job--status--${jobStatus()}`}>
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

          <div className="jenkins__job-progress--container">
          <span>
              {progress < 100 && `${Math.round(progress)}%`}
          </span>
          {progress < 100 && <div className="jenkins__job-status__current__progress-bar" style={progressStyle}/>}
          </div>
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