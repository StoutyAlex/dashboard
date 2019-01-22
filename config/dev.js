const env = require('dotenv').config().parsed;

const config = {

  wsPort: 3001,
  useWssConnection: process.env.USE_WSS === 'true',

  githubApiToken: (env ? env.REACT_APP_GITHUB_API_TOKEN : process.env.REACT_APP_GITHUB_API_TOKEN),

  apisPollInterval: 15000,
  
  api: {
    jenkins: {
        baseUrl: 'https://ci.silver.int.tools.bbc.co.uk',
        ca: "/etc/pki/cosmos/current/client.crt",
        cert: "/etc/pki/tls/certs/client.crt",
        certKey: "/etc/pki/tls/private/client.key",
    },
  },

  // Dashboard is 4 x 5
  // To change this goto ../styles/App.css and change the 
  // grid-template-columns and grid-template-rows
  dashboard: {
    widgets: [
      {
        type: 'jenkins.job',
        job: '/BBC/job/silver-ui-tests/job/master/',
        jobName: "API",
        columns: 2,
        rows: 2,
      },
      {
        type: 'jenkins.job',
        job: '/BBC/job/silver-api/job/master/',
        jobName: "Api",
        columns: 2,
        rows: 1,
      },
      {
        type: 'jenkins.job',
        job: '/BBC/job/silver-client/job/master/',
        jobName: "Client",
        columns: 2,
        rows: 1,
      },
      {
        type: 'pullrequests.count',
        title: 'Pull Requests',
        repositories: [
          'bbc/silver-api',
          'bbc/silver-client',
          'bbc/silver-brave',
          'bbc/silver-push',
        ],
        columns: 2,
        rows: 2,
      },
      {
        type: 'jenkins.job',
        job: '/BBC/job/silver-ui-tests/job/master/',
        jobName: "Client",
        columns: 2,
        rows: 6,
      },
      {
        type: 'jenkins.job',
        job: '/BBC/job/silver-ui-tests/job/master/',
        jobName: "E2E",
        columns: 2,
        rows: 1,
      },
      {
        type: 'jenkins.job',
        job: '/BBC/job/silver-brave/job/master/',
        jobName: "Brave",
        columns: 2,
        rows: 1,
      },
      {
        type: 'aws.scaling',
        name: 'int-silver-gateway-infrastructure-AutoScalingGroup-1UGKDTJ5U1CF2',
        title: 'Gateway',
        displayType: 'bar',
        columns: 2,
        rows: 1,
      },
      {
        type: 'aws.scaling',
        name: 'int-silver-gateway-infrastructure-AutoScalingGroup-1UGKDTJ5U1CF2',
        title: 'UI',
        displayType: 'bar',
        columns: 2,
        rows: 1,
      },
      {
        type: 'aws.scaling',
        name: 'int-silver-gateway-infrastructure-AutoScalingGroup-1UGKDTJ5U1CF2',
        title: 'API',
        displayType: 'bar',
        columns: 2,
        rows: 1,
      },


      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
      // {
      //   type: 'jenkins.job',
      //   job: '',
      //   jobName: "E2E",
      //   columns: 2,
      //   rows: 2,
      // },
    ]
  }
}

module.exports = config;
