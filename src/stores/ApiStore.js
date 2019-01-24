import Reflux from 'reflux';
import ApiActions from '../actions/ApiActions';
import config from '../../config';

const CONNECTION_RETRY_DELAY_SECONDS = 15;
const CONNECTION_MAX_RETRIES         = 10;
let retryCount = 0;

let reconnections = 0;

let ws = null;
let retryTimer;
let history = [];
let buffer  = [];


const clearRetryTimer = () => {
    if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
    }
};

const connectWS = (config, store) => {

  let proto = 'ws';
  if (config.useWssConnection === true) {
      proto = 'ws';
  }

  let port = window.document.location.port;
  if (config.wsPort !== undefined) {
      port = config.wsPort;
  }

  let wsUrl = `${proto}://${window.document.location.hostname}`;
  if (port && port !== '') {
      wsUrl = `${wsUrl}:${port}`;
  }

  ws = new WebSocket(wsUrl);

  ws.onopen = event => {
      clearRetryTimer();

      retryCount = 0;

      if (reconnections > 0) {
        history.forEach(request => { ws.send(JSON.stringify(request)); });
      } else {
        buffer.forEach(request => { ws.send(JSON.stringify(request)); });
        buffer = [];
      }
      reconnections++;
  };

  ws.onmessage = event => {
      if (event.data !== '') {
          store.trigger(JSON.parse(event.data));
      }
  };

  ws.onclose = event => {
      ws = null;
      
      clearRetryTimer();

      if (retryCount === CONNECTION_MAX_RETRIES) return;

      retryTimer = setTimeout(() => {
          connectWS(config, store);
      }, CONNECTION_RETRY_DELAY_SECONDS * 1000);

      retryCount++;
  };
};

const ApiStore = Reflux.createStore({
  init() {
    this.initWs(config);
  },

  initWs(config) {
      // only connect ws if it's not already connected, when connection is lost and we succeed in re-establishing it
      // we reload configuration, so without this check we'll end in an infinite loop.
      if (ws === null) {
          connectWS(config, this);
      }

      this.listenTo(ApiActions.get, this.fetch);
  },

  fetch(id, params = {}) {
      const request = { id, params };

      // keep track to use when re-connecting
      history.push(request);

      // if websockets not ready, add request to buffer
      if (ws === null || ws.readyState !== WebSocket.OPEN) {
          buffer.push(request);
          return;
      }

      ws.send(JSON.stringify({
          id:     id,
          params: params || {}
      }));
  },

  getHistory() {
      return history;
  },

  getBuffer() {
      return buffer;
  },

  reset() {
      clearRetryTimer();

      history = [];
      buffer  = [];

      if (ws !== null) {
          ws.close();
          ws = null;
      }
  }
});

export default ApiStore;