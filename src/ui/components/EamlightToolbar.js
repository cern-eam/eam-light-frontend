import './EamlightToolbar.css'
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from 'mdi-material-ui/ContentSaveOutline'
import AddIcon from '@material-ui/icons/Add';
import TelevisionGuide from 'mdi-material-ui/TelevisionGuide'
import DeleteIcon from 'mdi-material-ui/DeleteVariant'
import ConfirmationDialog from './ConfirmationDialog'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import AbstractToolbar from './AbstractToolbar';


const verticalLineStyle = {
    height: 25,
    borderRight: "1px solid gray",
    margin: 5
};

class EamlightToolbar extends Component {
    state = {
        open: false,
        compactMenu: false,
    };

    iconMenuStyle = {
        marginRight: 5,
        width: 20
    };


    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
        this.updateDimensions()
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions(event) {
        if (this.entityToolbarDiv) {
            this.setState({
                compactMenu: (this.entityToolbarDiv.clientWidth < this.props.width)
            })
        }
    }

    deleteHandler = () => {
        this.setState({open: true});
    };

    newHandler = () => {
        if (this.props.isModified) {
            this.newConfirmation.show()
        } else {
            this.props.newHandler()
        }
    };

    handleClose = (deleteEntity) => {
        if (deleteEntity === true) {
            this.props.deleteHandler()
        }
        this.setState({open: false});
    };

    isSaveButtonDisabled() {
        if (!this.props.newEntity && this.props.entityScreen && !this.props.entityScreen.updateAllowed) {
            return true
        }
        if (this.props.newEntity && this.props.entityScreen && !this.props.entityScreen.creationAllowed) {
            return true
        }
        return false
    }

    isNewButtonDisabled() {
        return this.props.entityScreen && !this.props.entityScreen.creationAllowed
    }

    isDeleteButtonDisabled() {
        return this.props.newEntity || (this.props.entityScreen && !this.props.entityScreen.deleteAllowed)
    }

    //
    // MORE MENU HANDLERS
    //
    handleMoreMenuClose() {
        if (this.state.moreMenu) {
            this.setState({moreMenu: null});
        }
    }

    handleMoreMenuClick(e) {
        this.setState({moreMenu: e.currentTarget});
    }

    //
    // VISIBILITY MENU HANDLERS
    //
    handleVisibilityMenuClose() {
        if (this.state.visibilityMenu) {
            this.setState({visibilityMenu: null});
        }
    }

    handleVisibilityMenuClick(e) {
        this.setState({visibilityMenu: e.currentTarget});
    }

    //
    //
    //
    getRegions = () => {
        const { regions, toggleHiddenRegion, getUniqueRegionID, isHiddenRegion } = this.props;
        return regions.map(region => (
            <MenuItem key={region.id} onClick={() => toggleHiddenRegion(getUniqueRegionID(region.id))}>
                <Checkbox disabled checked={!isHiddenRegion(region.id)}/>
                {region.label}
            </MenuItem>
        ))
    }

    //
    //
    //
    renderCompactMenu() {
        //this.props.entityToolbar.props.renderOption = 'MENUITEMS'
        return (
            <div>
                <Button
                    style={{padding: 8, minWidth: "unset"}}
                    aria-label="More"
                    aria-owns={this.state.moreMenu ? 'long-menu' : null}
                    onClick={this.handleMoreMenuClick.bind(this)}>
                    MORE
                    <SvgIcon style={{color: "rgba(0, 0, 0, 0.54)"}}>
                        <path d="M7 10l5 5 5-5z"/>
                    </SvgIcon>
                </Button>
                <Menu id="long-menu"
                      anchorEl={this.state.moreMenu}
                      open={Boolean(this.state.moreMenu)}
                      onClose={this.handleMoreMenuClose.bind(this)}>
                    <MenuItem onClick={this.newHandler} disabled={this.isNewButtonDisabled()}>
                        <AddIcon className="iconButton" style={this.iconMenuStyle}/>
                        <div style={this.menuLabelStyle}> New</div>
                    </MenuItem>
                    <MenuItem onClick={() => this.deleteConfirmation.show()} disabled={this.isDeleteButtonDisabled()}>
                        <DeleteIcon className="iconButton" style={this.iconMenuStyle}/>
                        <div style={this.menuLabelStyle}> Delete</div>
                    </MenuItem>
                    {this.getToolbar('MENUITEMS')}
                </Menu>
            </div>
        )
    }

    getToolbar = renderOption => 
        <AbstractToolbar {...this.props.toolbarProps} renderOption={renderOption}/>

    renderDesktopMenu() {
        const userData = this.props.userData;

        const camelCaseEntityName = this.props.entityName
            .split(' ')
            .map(word => word.toLowerCase())
            .map((word, index) => index === 0 ? word : word.replace(word[0], word[0].toUpperCase()))
            .join('');

        const screenName = userData[camelCaseEntityName + 'Screen'];

        return (
            <div style={{display: "flex", height: 36}}>
                <Button onClick={this.newHandler}
                        disabled={this.isNewButtonDisabled()}
                        startIcon={<AddIcon/>}
                >
                    New
                </Button>
                <Button onClick={() => this.deleteConfirmation.show()}
                        disabled={this.isDeleteButtonDisabled()}
                        startIcon={<DeleteIcon/>}
                >
                    Delete
                </Button>
                {this.getToolbar('TOOLBARICONS')}
                <div style={verticalLineStyle}/>
                <div style={{display: "flex", alignItems: "center", marginRight: 5}}>
                    <span style={{marginLeft: 5}}>{screenName}</span>
                </div>
            </div>
        )
    }

    render() {

        const entityCodeStyle = {
            marginLeft: 12,
            marginRight: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap"
        };

        return (
            <div className={"entityToolbar"} ref={entityToolbarDiv => this.entityToolbarDiv = entityToolbarDiv}>

                <div className={"entityToolbarContent"}>
                    <div style={this.state.compactMenu ? {...entityCodeStyle, flexBasis: "8em"} : entityCodeStyle}>
                        <div style={{display: "flex", alignItems: "center", marginRight: 5}}>
                            {this.props.entityIcon}
                            <span style={{marginLeft: 5}}>{this.props.entityName}</span>
                        </div>
                        <div>
                            {!this.props.newEntity && (<span
                                style={{fontWeight: 500, whiteSpace: "nowrap"}}> {this.props.entityKeyCode}</span>)}
                        </div>
                    </div>

                    <div style={verticalLineStyle}/>

                    <Button onClick={this.props.saveHandler}
                            disabled={this.isSaveButtonDisabled()}
                            startIcon={<SaveIcon className="iconButton"/>}
                    >
                        Save
                    </Button>

                    {this.state.compactMenu ? this.renderCompactMenu() : this.renderDesktopMenu()}
                </div>

                {this.props.regions &&
                    <div>
                        <IconButton
                            aria-label="More"
                            aria-owns={this.state.visibilityMenu ? 'simple-menu' : null}
                            onClick={this.handleVisibilityMenuClick.bind(this)}
                        >
                            <TelevisionGuide/>
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={this.state.visibilityMenu}
                            open={Boolean(this.state.visibilityMenu)}
                            onClose={this.handleVisibilityMenuClose.bind(this)}
                        >

                            {this.getRegions()}

                        </Menu>
                    </div>
                }

                <ConfirmationDialog
                    ref={deleteConfirmation => this.deleteConfirmation = deleteConfirmation}
                    onConfirm={this.props.deleteHandler}
                    title={"Delete " + this.props.entityName + "?"}
                    content={"Are you sure you would like to delete this " + this.props.entityName + "?"}
                    confirmButtonText="Delete"
                />

                <ConfirmationDialog
                    ref={newConfirmation => this.newConfirmation = newConfirmation}
                    onConfirm={this.props.newHandler}
                    title={"New " + this.props.entityName + "?"}
                    content={"Are you sure you would like to proceed without saving the changes?"}
                    confirmButtonText="Proceed"
                />

            </div>
        )
    }
}

export default EamlightToolbar
