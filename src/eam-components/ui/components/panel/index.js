import React, { Component } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import FontIcon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import Fullscreen from '@mui/icons-material/Fullscreen';
import { FullscreenExit } from 'mdi-material-ui';
import { styled } from '@mui/styles';

const CssAccordion = styled(Accordion)({
    "&.MuiAccordion-root": {
        boxShadow: "none",
        //margin: "8px"
      }
});

class EISPanel extends Component {
    state = {
        panelExpanded: true,
    };

    headingStyle = {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 500,
    };

    headingIconStyle = {
        fontSize: 20,
        marginRight: 7,
    };

    summaryStyle = {
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #EEEEEE',
        minHeight: '45px',
        height: '45px',
    };

    linkIconStyle = {
        color: '#00aaff',
    };
    linkClickHandler() {
        window.open(this.props.link, '_blank');
    }

    _onPanelChange = (object, expanded) => {
        if (this.props.alwaysExpanded) {
            expanded = true;
        }
        this.setState(() => ({
            panelExpanded: expanded,
        }));

        if (this.props.onPanelChange) {
            this.props.onPanelChange(expanded);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // if panelExpanded is passed as prop and is different from the current
        // state.panelExpanded then we update the state
        if (typeof nextProps.panelExpanded !== 'undefined' && nextProps.panelExpanded !== prevState.panelExpanded) {
            return {
                panelExpanded: nextProps.panelExpanded,
            };
        }

        // No state update necessary
        return null;
    }

    render() {
        const linkIcon = this.props.icon;
        return (
            <CssAccordion
                defaultExpanded
                expanded={this.props.alwaysExpanded ? true : this.state.panelExpanded}
                TransitionProps={{ timeout: 300 }}
                onChange={this._onPanelChange}
                {...this.props.AccordionProps}
            >
                <AccordionSummary
                    expandIcon={this.props.alwaysExpanded ? undefined : <ExpandMoreIcon />}
                    style={this.summaryStyle}
                >
                    <div style={this.headingStyle}>
                        {this.props.headingIcon && (
                            <FontIcon style={this.headingIconStyle} className={'fa ' + this.props.headingIcon} />
                        )}
                        <div>{this.props.heading}</div>
                        {this.props.link && (
                            <IconButton
                                onClick={this.linkClickHandler.bind(this)}
                                style={{ height: 'auto', width: 35 }}
                                size="large">
                                <linkIcon style={this.linkIconStyle} />
                            </IconButton>
                        )}
                        {this.props.headingBar}
                    </div>
                </AccordionSummary>

                <AccordionDetails style={{ backgroundColor: "#fafafa", ...this.props.detailsStyle }}>{this.props.children}</AccordionDetails>
            </CssAccordion>
        );
    }
}

export const withFullscreen = (props) => (Component) => {
    const { isOpen, onFullscreenOpen, onFullscreenClose } = props;
    return (props) => (
        <Component
            headingBar={
                isOpen ? (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onFullscreenOpen();
                        }}
                        size="large">
                        <Fullscreen />
                    </IconButton>
                ) : (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onFullscreenClose();
                        }}
                        size="large">
                        <FullscreenExit />
                    </IconButton>
                )
            }
            {...props}
        />
    );
};

EISPanel.defaultProps = {
    alwaysExpanded: false,
    onPanelChange: undefined,
    icon: <OpenInNewIcon />,
};

export default EISPanel;
