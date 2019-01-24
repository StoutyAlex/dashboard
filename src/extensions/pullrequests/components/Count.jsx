import React from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import ApiConsumer from '../../../mixin/apiMixin';

import PRCell from './PRCell';

import '../../../styles/extensions/count.css';
import '../../../styles/Widget.css';

class Count extends React.Component {
  constructor(props) {
    super(props);
    this.state = { totalPullRequests: -1, pullRequestObjects: [] };
  }

  getApiRequest(){
    const { repositories } = this.props;
    return {
      id: `pullrequests.count.${repositories.length}`,
      params: { repositories }
    }
  }

  onApiData(data) {
    this.setState(data);
  }

  render() {
    const { title } = this.props;
    let { pullRequestObjects } = this.state;
    
    pullRequestObjects = pullRequestObjects.sort((pr1, pr2) => {
      if (pr1.pullRequests < pr2.pullRequests) return 1;
      if (pr1.pullRequests > pr2.pullRequests) return -1;
      return 0
    });

    const maxCells = 3;
    let currentCells = 0;

    const repoCells = pullRequestObjects.map((pullRequest, index) => {
      if (currentCells !== maxCells) {
        currentCells++;
        return <PRCell
          key={pullRequest.repoName}
          name={pullRequest.repoName}
          count={pullRequest.pullRequests}
          max={maxCells} />
      }
      return null;
    });

    return (
      <div className="pullrequests__count--container">
        <div className="pullrequests__count--background">
          <div className="header">
            {title}
          </div>
          <div className="pullrequests__count--total">
            {this.state.totalPullRequests}
          </div>
          <div className="pullrequests__count--indiviual-container">
            {repoCells}
          </div>
        </div>
      </div>
    );
  }
};

reactMixin(Count.prototype, ListenerMixin);
reactMixin(Count.prototype, ApiConsumer);

export default Count;

