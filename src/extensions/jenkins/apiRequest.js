import axios from 'axios';
import convict from 'convict';
import https from 'https';
import fs from 'fs';
import config from '../../../config';
import request from 'superagent';
import HttpClient from '@bbc/http-client'

const apiRequest = () => {
  const httpClient = new HttpClient();
  const baseUrl = config.api.jenkins.baseUrl;
  const headers = { Accept: 'application/json' };

  const buildRequest = (url) => {
    return httpClient.get({ url, headers })
    .then((res) => JSON.parse(res).builds)
    .catch((error) => {
      console.log(error);
    });
  }

  const apiMethods = {
    job(params) {
      return buildRequest(`${baseUrl}/job/${params.job}/api/json?pretty=true&depth=10&tree=builds[number,estimatedDuration,duration,result,builtOn,timestamp,id,building,url]`);
    },
  }
  return apiMethods;
};

export {
  apiRequest,
}