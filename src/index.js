import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ComponentRegistry from './util/component-registry';

import jenkins from './extensions/jenkins';
import pullrequests from './extensions/pullrequests';
import aws from './extensions/aws';
import status from './extensions/status';

import './index.css';

const registry = ComponentRegistry;

registry.addExtensions({
  aws,
  jenkins,
  pullrequests,
  status,
});

ReactDOM.render(<App registry={registry} />, document.getElementById('root'));
