import React, {Component} from 'react';
import PropTypes from 'prop-types';


/**
 * Label displayed at the left of a form field
 */
export default class EAMFormLabel extends Component {

    render() {
        if (!this.props.label)
            return null;
        //Check error
        let labelStyle = {...EAMFormLabel.defaultProps.labelStyle, ...this.props.labelStyle};
        if (this.props.error) {
            labelStyle = {...labelStyle, color: '#f03369'};
        }
        //Render
        return (
            <div className={this.props.required ? 'fieldRequired' : ''}
                 style={labelStyle}>
                {this.props.label}
            </div>
        );
    }

}

EAMFormLabel.propTypes = {
    labelStyle: PropTypes.object
};

EAMFormLabel.defaultProps = {
    labelStyle: {
        width: 130,
        minWidth: 130,
        marginRight: 10,
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: '#006598',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center'
    }
};