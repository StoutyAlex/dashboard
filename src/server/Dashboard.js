import server from '.';
import express from 'express';
import ClientManager from './clientManager';

class Dashboard {
  constructor(config) {
    this.config = config;
    this.apiManager = ClientManager(config);
  }

  startServer(app) {
    app = app || express();
    server(this, app);
  }
}

export default Dashboard;
