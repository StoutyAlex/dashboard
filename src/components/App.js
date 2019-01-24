import React, { Component } from 'react';

import Widget from './Widget';
import config from '../../config';
import _ from 'lodash';

// Add in styles
import '../styles/App.css';
import '../styles/fonts.css';

class App extends Component {
    render() {
        const { widgets } = config.dashboard;

        const widgetNodes = widgets.map((widget, index) => {
            const props = _.extend({}, _.omit(widget, ['columns', 'rows']), {
                key: `widget.${index}`,
                type: widget.type,
                title: widget.title,
                colspan: widget.columns,
                rowspan: widget.rows,
                registry: this.props.registry,
            });

            return React.createElement(Widget, props);
        });

        return (
            <div className="App">
                {widgetNodes}
            </div>
        );
    }
}

export default App;