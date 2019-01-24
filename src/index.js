import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ComponentRegistry from './util/component-registry';

import jenkins from './extensions/jenkins';
import pullrequests from './extensions/pullrequests';
import aws from './extensions/aws';
import status from './extensions/status';
import environment from './extensions/environment';
import live from './extensions/live';
import spacer from './extensions/spacer';

import './index.css';

const registry = ComponentRegistry;

registry.addExtensions({
  spacer,
  aws,
  jenkins,
  pullrequests,
  status,
  environment,
  live,
});

ReactDOM.render(<App registry={registry} />, document.getElementById('root'));
