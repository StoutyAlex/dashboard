import config from '../config';
import Dashboard from './server/Dashboard';

import { apiRequest as jenkins } from './extensions/jenkins/apiRequest';
import { apiRequest as pullrequests } from './extensions/pullrequests/apiRequest';
import { apiRequest as aws } from './extensions/aws/apiRequest';
import { apiRequest as status } from './extensions/status/apiRequest';
import { apiRequest as live } from './extensions/live/apiRequest';

const dashboard = new Dashboard(config);

dashboard.apiManager.registerApi('jenkins', jenkins);
dashboard.apiManager.registerApi('pullrequests', pullrequests);
dashboard.apiManager.registerApi('aws', aws);
dashboard.apiManager.registerApi('status', status);
dashboard.apiManager.registerApi('live', live);

dashboard.startServer();
