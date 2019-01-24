import _ from 'lodash';

const API_MODE_POLL = 'poll';
const API_MODE_PUSH = 'push';

const ClientManager = (config) => {
  const { apisPollInterval } = config;

  const apis          = {};
  const clients       = {};
  const subscriptions = {};
    
  const addClient = (client, id) => {
    if (_.has(clients, id)) {
        const errMsg = `Client with id '${id}' already exists`;
        console.log(errMsg);
        throw new Error(errMsg);
    }
    clients[id] = client;
    console.log(`Client #${id} connected`);
  };

  const removeClient = (id) => {
    _.forOwn(subscriptions, (subscription, subscriptionId) => {
        subscription.clients = _.without(subscription.clients, id);

        // if there's no more subscribers, clear the interval
        // to avoid consuming APIs for nothing.
        if (subscription.clients.length === 0 && subscription.timer) {
            console.log(`removing interval for '${subscriptionId}'`);
            clearInterval(subscription.timer);
            delete subscription.timer;
        }
    });
    delete clients[id]; 
    console.log(`Client #${id} disconnected`);
  };

  const send = (subscriptionId, data) => {
    if (!_.has(subscriptions, subscriptionId)) {
      console.log(`No Subscription matching ${subscriptionId}`);
      return;
    }
    subscriptions[subscriptionId].clients.forEach((clientId) => {
        clients[clientId].send(JSON.stringify(data));
    });
  }

  const registerApi = (id, api, mode = API_MODE_POLL) => {
    if (_.has(apis, id)) {
        const errMsg = `API '${id}' already registered`;
        console.log(errMsg);
        throw new Error(errMsg);
    }

    apis[id] = { methods: api(), mode };
    console.log((`registered API '${id}' (mode: ${mode})`));
  };

  const processApiCall = (id, callFn, params) => {
    console.log(`Calling '${id}'`);

    callFn(params)
        .then(data => {
            const message = { id, body: data };
            // cache message
            subscriptions[id].cached = message;
            send(id, message);
        })
        .catch(err => {
            console.log((`[${id.split('.')[0]}] ${id} - status code: ${err.status || err.statusCode}`));
        })
    ;
  };


  const clientSubscription = (clientId, request) => {
    if (!_.has(clients, clientId)) {
        console.log(`Unable to find a client with id '${clientId}'`);
        return;
    }

    const requestId = request.id;
    const parts     = requestId.split('.');
    let errMsg;
    if (parts.length < 2) {
        errMsg = `Invalid request id '${requestId}', should be something like 'api_id.method'`;
        console.log(errMsg);
        throw new Error(errMsg);
    }

    if (!_.has(apis, parts[0])) {
        errMsg = `Unable to find API matching id '${parts[0]}'`;
        console.log(errMsg);

        throw new Error(errMsg);
    }

    const api = apis[parts[0]];
    console.log(api.methods);
    console.log(api);
    if (!_.has(api.methods, parts[1])) {
        errMsg = `Unable to find API method matching '${parts[1]}'`;
        console.log(errMsg);
        throw new Error(errMsg);
    }

    const callFn = api.methods[parts[1]];
    if (!_.isFunction(callFn)) {
        errMsg = `API method '${parts[0]}.${parts[1]}' MUST be a function`;
        console.log(errMsg);
        throw new Error(errMsg);
    }

    if (!subscriptions[requestId]) {
        subscriptions[requestId] = {
            clients:         [],
            currentResponse: null
        };

        console.log(`Added subscription '${requestId}'`);

        if (api.mode === API_MODE_POLL) {
            // make an immediate call to avoid waiting for the first interval.
            processApiCall(requestId, callFn, request.params);
        } else if (api.mode === API_MODE_PUSH) {
          console.log(`Creating producer for '${requestId}'`);
            callFn(data => {
                send(requestId, {
                    id:   requestId,
                    body: data
                });
            }, request.params);
        }
    }

    // if there is no interval running, create one
    if (!subscriptions[requestId].timer && api.mode === API_MODE_POLL) {
      console.log(`Setting timer for '${requestId}'`);
        subscriptions[requestId].timer = setInterval(() => {
            processApiCall(requestId, callFn, request.params);
        }, apisPollInterval);
    }

    // avoid adding a client for the same API call twice
    if (subscriptions[requestId].clients.indexOf(clientId) === -1) {
        subscriptions[requestId].clients.push(clientId);

        // if there's an available cached response, send it immediately
        if (subscriptions[requestId].cached !== null) {
            clients[clientId].send(JSON.stringify(subscriptions[requestId].cached));
        }
    }
  };

  const listApis = () => {
    const apiIds = [];
    _.forOwn(apis, (api, id) => {
        apiIds.push(id);
    });

    return apiIds;
  };

  const listClients = () => clients;

  const listSubscriptions = () => subscriptions;

  const clientCount = () => {
      return _.keys(clients).length;
  };

  return {
    registerApi,
    addClient,
    removeClient,
    listClients,
    processApiCall,
    clientSubscription,
    listSubscriptions,
    listApis,
    clientCount,
  }
}

export default ClientManager;