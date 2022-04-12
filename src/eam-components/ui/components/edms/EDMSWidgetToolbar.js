import React, {Component} from 'react';
import IconButton from '@mui/material/IconButton';
import ImageFilter from 'mdi-material-ui/ImageFilter'
import FormatListBulleted from 'mdi-material-ui/FormatListBulleted'
import PlusBox from 'mdi-material-ui/PlusBox'
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';

class EDMSWidgetToolbar extends Component {

    mainDivStyle = {
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgb(238, 238, 238)"
    };

    separatorStyle = {
        flex: "1 1 auto"
    };

    computeDocumentCreationStyle = () => ({
        color: this.props.documentCreationVisible ? 'rgb(0, 170, 255)' : 'rgba(0, 0, 0, 0.54)'
    });

    computeGalleriaButtonStyle = () => ({
        color: this.props.currentView === 'GALLERIA' ? 'rgb(0, 170, 255)' : 'rgba(0, 0, 0, 0.54)'
    });

    computeDoclistButtonStyle = () => ({
        color: this.props.currentView === 'DOCLIST' ? 'rgb(0, 170, 255)' : 'rgba(0, 0, 0, 0.54)'
    });

    linkClickHandler() {
        window.open(this.props.link, '_blank');
    }

    render() {
        return (
            <div style={this.mainDivStyle}>

                {this.props.link && (
                    <IconButton
                        onClick={this.linkClickHandler.bind(this)}
                        style={{ color: "#00aaff" }}
                        size="large">
                        <OpenInNewIcon />
                    </IconButton>
                )}

                {!this.props.documentCreationDisabled &&
                    <IconButton
                        onClick={this.props.documentCreationHandler}
                        style={this.computeDocumentCreationStyle()}
                        size="large">
                        <PlusBox/>
                    </IconButton>}

                <div style={this.separatorStyle}/>
                <IconButton
                    onClick={this.props.doclistClickHandler}
                    style={this.computeDoclistButtonStyle()}
                    size="large">
                    <FormatListBulleted/>
                </IconButton>
                <IconButton
                    onClick={this.props.galleriaClickHandler}
                    style={this.computeGalleriaButtonStyle()}
                    size="large">
                <ImageFilter/>
                </IconButton>
            </div>
        );
    }
}

export default EDMSWidgetToolbar