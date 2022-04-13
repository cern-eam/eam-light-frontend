import React from 'react'
import ReactDOM from 'react-dom';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
    root: {
        height: 'calc(100% - 67px)',
        overflowY: 'auto',
        backgroundColor: '#eeeeee',
        padding: theme.spacing()
    }
})

const RegionPanelPortal = (props) => {
    const { children, classes } = props;
    const parent =  document.getElementById('entityContent');
    const root = parent.parentElement;
    const [container] = React.useState(document.createElement('div'));
    React.useEffect(() => {
        root.insertBefore(container, parent);
        container.classList.add(classes.root);
        return () => root.removeChild(container)
    });

    return ReactDOM.createPortal(children, container)
}

export default withStyles(styles)(RegionPanelPortal);
