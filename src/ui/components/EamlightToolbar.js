import './EamlightToolbar.css'
import React, { useEffect, useState, useRef } from 'react';
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
import Toolbar from './Toolbar';
import useLocalStorage from '../../hooks/useLocalStorage';

const iconMenuStyle = {
    marginRight: 5,
    width: 20
};

const verticalLineStyle = {
    height: 25,
    borderRight: "1px solid gray",
    margin: 5
};

const entityCodeStyle = {
    marginLeft: 12,
    marginRight: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
};

const EamlightToolbar = (props) => {
    const [open, setOpen] = useState(false);
    const [compactMenu, setCompactMenu] = useState(false);
    const [moreMenu, setMoreMenu] = useState(null);
    const [visibilityMenu, setVisibilityMenu] = useState(null);
    const entityToolbarDiv = useRef();
    const deleteConfirmation = useRef();
    const newConfirmation = useRef();
    const [hiddenRegions, toggleHiddenRegion] = useLocalStorage('hiddenRegions', {});

    useEffect(() => {
        window.addEventListener("resize", updateDimensions.bind(this));
        updateDimensions();
        return window.removeEventListener("resize", updateDimensions); 
    }, []);

    const updateDimensions = (event) => {
        if (entityToolbarDiv) {
            setCompactMenu(entityToolbarDiv.current.clientWidth < props.width);
        }
    }

    const deleteHandler = () => {
        setOpen(true);
    };

    const newHandler = () => {
        if (props.isModified) {
            newConfirmation.show()
        } else {
            props.newHandler()
        }
    };

    const handleClose = (deleteEntity) => {
        if (deleteEntity === true) {
            props.deleteHandler()
        }
        this.setOpen(false);
    };

    const isSaveButtonDisabled = () => {
        const { newEntity, entityScreen, departmentalSecurity } = props;

        if (!entityScreen) {
            return true;
        }

        return (!newEntity && !entityScreen.updateAllowed)
            || (newEntity && !entityScreen.creationAllowed)
            || departmentalSecurity.readOnly;
    }

    const isNewButtonDisabled = () => {
        const { entityScreen } = props;

        if (!entityScreen) {
            return true;
        }

        return !entityScreen.creationAllowed;
    }

    const isDeleteButtonDisabled = () => {
        const { newEntity, entityScreen, departmentalSecurity } = props;

        if (!entityScreen) {
            return true;
        }

        return newEntity
            || !entityScreen.deleteAllowed
            || departmentalSecurity.readOnly;
    }

    //
    // MORE MENU HANDLERS
    //
    const handleMoreMenuClose = () => {
        if (moreMenu) {
            setMoreMenu(null);
        }
    }

    const handleMoreMenuClick = (e) => {
        setMoreMenu(e.currentTarget);
    }

    //
    // VISIBILITY MENU HANDLERS
    //
    const handleVisibilityMenuClose = () => {
        if (visibilityMenu) {
            setVisibilityMenu(null);
        }
    }

    const handleVisibilityMenuClick = (e) => {
        setVisibilityMenu(e.currentTarget);
    }

    //
    //
    //
    const getRegions = () => {
        const { regions, getUniqueRegionID } = props;
        const toggleRegion = (region) => {
            const hidRegions = {
                ...hiddenRegions,
                [getUniqueRegionID(region.id)]: !hiddenRegions[getUniqueRegionID(region.id)]
            }
            toggleHiddenRegion(hidRegions);
            props.setHiddenRegions(hidRegions);
        }
        
        return regions
            .filter(region => !region.ignore)
            .map(region => (
                <MenuItem key={region.id} onClick={() => toggleRegion(region)}>
                    <Checkbox disabled checked={!hiddenRegions[getUniqueRegionID(region.id)]}/>
                    {region.label}
                </MenuItem>
        ))
    }

    //
    //
    //
    const renderCompactMenu = () => {
        //props.entityToolbar.props.renderOption = 'MENUITEMS'
        return (
            <div>
                <Button
                    style={{padding: 8, minWidth: "unset"}}
                    aria-label="More"
                    aria-owns={moreMenu ? 'long-menu' : null}
                    onClick={handleMoreMenuClick.bind(this)}>
                    MORE
                    <SvgIcon style={{color: "rgba(0, 0, 0, 0.54)"}}>
                        <path d="M7 10l5 5 5-5z"/>
                    </SvgIcon>
                </Button>
                <Menu id="long-menu"
                      anchorEl={moreMenu}
                      open={Boolean(moreMenu)}
                      onClose={handleMoreMenuClose.bind(this)}>
                    <MenuItem onClick={newHandler} disabled={isNewButtonDisabled()}>
                        <AddIcon className="iconButton" style={iconMenuStyle}/>
                        <div> New</div>
                    </MenuItem>
                    <MenuItem onClick={() => deleteConfirmation.current.show()} disabled={isDeleteButtonDisabled()}>
                        <DeleteIcon className="iconButton" style={iconMenuStyle}/>
                        <div> Delete</div>
                    </MenuItem>
                    {getToolbar('MENUITEMS')}
                </Menu>
            </div>
        )
    }

    const getToolbar = (renderOption) => <Toolbar {...props.toolbarProps} renderOption={renderOption}/>

    const renderDesktopMenu = () => {
        return (
            <div style={{display: "flex", height: 36}}>
                <Button onClick={newHandler}
                        disabled={isNewButtonDisabled()}
                        startIcon={<AddIcon/>}
                >
                    New
                </Button>
                <Button onClick={() => deleteConfirmation.current.show()}
                        disabled={isDeleteButtonDisabled()}
                        startIcon={<DeleteIcon/>}
                >
                    Delete
                </Button>
                {getToolbar('TOOLBARICONS')}
            </div>
        )
    }

    const { entityScreen, entityIcon, entityKeyCode, entityName, newEntity, regions, isLocalAdministrator, saveHandler } = props;
    return (
        <div className={"entityToolbar"} ref={entityToolbarDiv}>

            <div className={"entityToolbarContent"} style={{flexShrink: 0}}>
                <div style={compactMenu ? {...entityCodeStyle, flexBasis: "8em"} : entityCodeStyle}>
                    <div style={{display: "flex", alignItems: "center", marginRight: 5}}>
                        {entityIcon}
                        <span style={{marginLeft: 5}}>{entityName}</span>
                    </div>
                    <div>
                        {!newEntity && (<span style={{fontWeight: 500, whiteSpace: "nowrap"}}>{entityKeyCode}</span>)}
                    </div>
                </div>

                <div style={verticalLineStyle}/>

                <Button onClick={saveHandler}
                        disabled={isSaveButtonDisabled()}
                        startIcon={<SaveIcon className="iconButton"/>}
                >
                    Save
                </Button>

                {compactMenu ? renderCompactMenu() : renderDesktopMenu()}

            </div>

            <div className={"entityToolbarContent"} style={{minWidth: 0}}>
                {isLocalAdministrator && <>
                    <span style={{
                        marginRight: 5,
                        color: '#ccc',
                        fontWeight: 'lighter',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: '0px'}}>{entityScreen.screenCode}</span>
                    <div style={{...verticalLineStyle, borderRightColor: '#ccc'}}/>
                </>}
                {regions && <div style={{flexGrow: '1'}}>
                    <IconButton
                        aria-label="More"
                        aria-owns={visibilityMenu ? 'simple-menu' : null}
                        onClick={handleVisibilityMenuClick.bind(this)}
                    >
                        <TelevisionGuide/>
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={visibilityMenu}
                        open={Boolean(visibilityMenu)}
                        onClose={handleVisibilityMenuClose.bind(this)}
                    >

                        {getRegions()}

                    </Menu>
                </div>}
            </div>

            <ConfirmationDialog
                ref={deleteConfirmation}
                onConfirm={props.deleteHandler}
                title={"Delete " + entityName + "?"}
                content={"Are you sure you would like to delete this " + entityName + "?"}
                confirmButtonText="Delete"
            />

            <ConfirmationDialog
                ref={newConfirmation}
                onConfirm={props.newHandler}
                title={"New " + entityName + "?"}
                content={"Are you sure you would like to proceed without saving the changes?"}
                confirmButtonText="Proceed"
            />

        </div>
    );
}

EamlightToolbar.defaultProps = {
    departmentalSecurity: {},
}

export default EamlightToolbar
