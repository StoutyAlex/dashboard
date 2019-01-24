
export default function (dashboard, app) {

  const { host, port } = dashboard.config;

  const server = app.listen(port, host, function () {
    console.log(`Data being served from http://${host}:${port}`);
  });

  const WebSocketServer = require('ws').Server;
  const wss = new WebSocketServer({ server: server });

  let currentClientId = 0;

  wss.on('connection', (ws) => {
    const clientId = ++currentClientId;

    dashboard.apiManager.addClient(ws, clientId);

    ws.on('message', (request) => {
        dashboard.apiManager.clientSubscription(clientId, JSON.parse(request));
    });

    ws.on('close', () => {
        dashboard.apiManager.removeClient(clientId);
    });
  });
}