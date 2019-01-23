import React, { Component, PropTypes } from 'react';
import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';
import ApiConsumer from '../../../mixin/apiMixin';
import Session from './Session';
import { 
    fpsRAG,
    resolutionRAG,
    videoCodecRAG,
    audioCodecRAG,
    bitrateRAG 
  } from '../util';


import '../../../styles/extensions/live.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  getApiRequest() {
    const { url } = this.props;
    return {
      id: `live.list.${url}`,
      params: { url }
    };
  }

  onApiData(data) {
    this.setState({ data: this.sortSessionsByStatus(data.data) });
  }

  getRAGStatus(sources){
      const statusColours = sources.reduce((acc, source) => {
          if (source.receiving === 0) acc.push('red');
          else {
              acc.push(fpsRAG(parseFloat(source.sourceStat.fps)));
              acc.push(resolutionRAG(source.sourceStat.resolution));
              acc.push(videoCodecRAG(source.sourceStat.video_codec));
              acc.push(audioCodecRAG(source.sourceStat.audio_codec));
              acc.push(bitrateRAG(parseFloat(source.sourceStat.bitrate)));
          }
          return acc;
      }, []);
      if (statusColours.indexOf('red') >= 0) return 'red';
      else if (statusColours.indexOf('amber') >= 0) return 'amber';
      return 'green';
  }

  sortSessionsByStatus(data){
      if (data) {
          return data.map((session) => {
              const status = this.getRAGStatus(session.sources);
              return Object.assign({}, session, { status: status })
          }).sort((session1, session2) => {
              if (session1.status[1] < session2.status[1]) return -1;
              if (session1.status[1] > session2.status[1]) return 1;
              return 0;
          });
      } else return [];
  }

  render() {
    return (
      <div>
        <div style={{height: 90, width: '100%', padding: 8}}>
          <div className="environment--text-container">
            <div className="environment--text" style={{backgroundColor:'#2d4052', height: '100%', fontSize: '2em', textAlign: 'center'}}>
              Live Sessions 
            </div>
          </div>
        </div>
        <div style={{padding: 8}}>
          {this.state.data.map((session) => {
            return ( <Session 
                key={session.id}                    
                sessionId={session.id}
                sessionTitle={session.title}
                status={session.status}
                />
            )
          })}
        </div>
      </div>
    );
  }
}

reactMixin(List.prototype, ListenerMixin);
reactMixin(List.prototype, ApiConsumer);

List.displayName = "livelist";

List.propTypes = {
  url: PropTypes.string.isRequired,
};

export default List;