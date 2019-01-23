import express from 'express';
import { apiRequest as jenkins } from '../src/extensions/jenkins/apiRequest';
import { apiRequest as pullrequests } from '../src/extensions/pullrequests/apiRequest';
import { apiRequest as aws } from '../src/extensions/aws/apiRequest';
import { apiRequest as status } from '../src/extensions/status/apiRequest';
import { apiRequest as live } from '../src/extensions/live/apiRequest';
import ClientManager from './clientManager';
import config from '../config';
import { stat } from 'fs';

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if(process.argv.includes("delayresponse")) {
        setTimeout(function(){
            next();
        }, 2000);
    } else {
        next();
    }
});

const server = app.listen(3002, function () {
    console.log('Data being served from http://localhost:3001');
});

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });

let currentClientId = 0;

const clientManager = ClientManager(config);

wss.on('connection', (ws) => {
    const clientId = ++currentClientId;

    clientManager.addClient(ws, clientId);

    ws.on('message', (request) => {
        clientManager.clientSubscription(clientId, JSON.parse(request));
    });

    ws.on('close', () => {
        clientManager.removeClient(clientId);
    });
});

clientManager.registerApi('jenkins', jenkins);
clientManager.registerApi('pullrequests', pullrequests);
clientManager.registerApi('aws', aws);
clientManager.registerApi('status', status);
clientManager.registerApi('live', live);
