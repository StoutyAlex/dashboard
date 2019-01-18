import React, { Component } from 'react';
import _ from 'lodash';
// import ComponentRegistry from '../util/component-registry';

// Import components
import Loading from './Loading';

//Import styling
import '../styles/Widget.css';

class Widget extends Component {
    constructor(props) {
        super(props);
        this.spanStyles = {};
        if (props.colspan !== 1) {
            this.spanStyles.gridColumn = `span ${props.colspan}`;
        }
        if (props.rowspan !== 1) {
            this.spanStyles.gridRow = `span ${props.rowspan}`;
        }
    }

    render() {
        const { type, registry, title } = this.props;

        const childProps = _.omit(this.props, ['type', 'x', 'y', 'width', 'height']);

        console.log('type' + type);

        const widget = React.createElement(registry.get(type), childProps);

        return (
            <div style={this.spanStyles} className="Widget">
                <div className="content">
                    {widget}
                </div>
            </div>
        );
    }
}

// Provide default settings for when they aren't supplied
Widget.defaultProps = {
    title: undefined,
    colspan: 1,
    rowspan: 1
}

// Enforce the type of props to send to this component
Widget.propTypes = {
    title: React.PropTypes.string,
    colspan: React.PropTypes.number,
    rowspan: React.PropTypes.number,
}

export default Widget;