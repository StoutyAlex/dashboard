import React, { PropTypes } from 'react';
import Clock from './Clock';

import '../../../styles/extensions/display.css';

const Display = ({ environment }) => (
      <div className="environment--container">
        <div className="environment--env-container">
          <div className="environment--env-highlight">
            <div className="environment--text-container">
              <div className="environment--text">
                {environment}
              </div>
            </div>
          </div>
        </div>
        <div className="environment--clock-container">
          <Clock />
        </div>
      </div>
    );

Display.displayName = 'environment';

Display.propTypes = {
  environment: PropTypes.string.isRequired,
};

export default Display;