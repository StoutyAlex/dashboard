import React, { PropTypes } from 'react';

const Session = ({ sessionId, sessionTitle, status }) => {
  sessionTitle = sessionTitle.trim();
  
  if (sessionTitle.length > 22) {
    sessionTitle = `${sessionTitle.slice(0, 22).trim()}...`;
  }

  const iconName = () => {
    if (status === 'red') return 'times';
    if (status === 'amber') return 'exclamation-triangle';
    if (status === 'green') return 'check';
  }

  return (
    <div className={`session-item--container session-item-stauts--${status}`}>
      <i className={`fa fa-${iconName()}`}></i>&nbsp;&nbsp;{sessionId}&nbsp;&nbsp;:&nbsp;&nbsp;{sessionTitle}
    </div>
  );
};

Session.displayName = "session";

Session.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}

export default Session;