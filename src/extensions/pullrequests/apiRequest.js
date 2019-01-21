import HttpClient from '@bbc/http-client'
import request from 'superagent-bluebird-promise';

const apiRequest = () => {
  const baseUrl = 'https://api.github.com/repos/';

  let pullRequestObjects = [];
  let totalPullRequests = 0;

  const fetchRepoPullRequests = async (repo) => {
    await request.get(`${baseUrl}${repo}/pulls`)
    .set('Authorization', `token 8a850ee68b24c843a1b749ba9cfcc5f1f690218c`)
    .then((res) => {
      appendPullRequest(repo, res.body.length);
    });
  }

  const appendPullRequest = (repo, pullRequests) => {
    const repoName = repo.split("bbc/").join('');
    totalPullRequests+=pullRequests;
    pullRequestObjects.push({ repoName, pullRequests });
  };

  const fetchOverallPullRequests = async (repositories) => {
    pullRequestObjects = [];
    totalPullRequests = 0;
    for (var i = 0; i < repositories.length; i++) {
      await fetchRepoPullRequests(repositories[i]);
    };
    return new Promise((resolve, reject) => { resolve({pullRequestObjects, totalPullRequests}) });    
  };

  const apiMethods = {
    count(params) {
      return fetchOverallPullRequests(params.repositories);
    },
  }
  return apiMethods;
};

export {
  apiRequest,
}