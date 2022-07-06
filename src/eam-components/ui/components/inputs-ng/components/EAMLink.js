import React from 'react';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import { Link } from 'react-router-dom';

const EAMLink = ({link, value}) => {

    let eamLink = null;

    if (link && link(value)) {
        if (link().startsWith('http')) {
            eamLink = React.forwardRef((props, ref) => (
                <a href={link(value)} {...props} target="_blank" rel="noopener noreferrer" />
            ));
        } else {
            eamLink = React.forwardRef((props, ref) => <Link to={link(value)} {...props} />);
        }
    }

    return (<IconButton component={eamLink} disabled={!value}>
                <OpenInNewIcon />
            </IconButton>);
}


export default EAMLink;