import request from 'request-promise';
import config  from '../../../config';
import fs      from 'fs';
require('superagent-bluebird-promise');

const apiRequest = () => {

    const certFilePath = config.api.request.cert;
    const keyFilePath = config.api.request.certKey;

    let cert;
    let certKey;

    if (certFilePath.length > 0) {
      try {
        cert = fs.readFileSync(certFilePath);
      } catch(error) {
        console.log(`[status] an error occurred while trying to read custom certificate (${ error })`);
        throw error;
      }
    }

    if (keyFilePath.length > 0) {
      try {
        certKey = fs.readFileSync(keyFilePath);
      } catch(error) {
        console.log(`[status] an error occurred while trying to read custom certificate (${ error })`);
        throw error;
      }
    }

    const apiMethods = {
        ping(params) {
            const url = params.url;
            const options = {
              url: url,
              rejectUnauthorized: false,
              agentOptions: {
                cert: cert,
                key: certKey
              },
              resolveWithFullResponse: true
            };

            const requestStartTime = new Date();
            return request(options)
                .then((response) => {
                  return {
                    statusCode: response.statusCode,
                    responseTime:  new Date() - requestStartTime
                  };
                })
                .catch(() => {
                    return {
                        statusCode: -1,
                        responseTime:  -1
                    }
                })
        }
    };

    return apiMethods;
};

export {
  apiRequest,
}