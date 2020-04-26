import React from 'react'
import {
    Button,
    Dialog, 
    DialogActions,
    DialogContent, 
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormControl,
    FormControlLabel
} from '@material-ui/core';
import { FilterNone } from '@material-ui/icons';
import queryString from 'query-string';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ParametrizedURLDialog = (props) => {
    const { title, open, onClose, url, params = {} } = props;
    const [paramsSelected, setParamsSelected] = React.useState(Object.keys(params));

    const handleSelectAll = () => 
        isAllChecked()
        ? setParamsSelected([])
        : setParamsSelected(getAllParamKeys())


    const handleSelectParam = (param) => () => {
        paramsSelected.includes(param)
        ? setParamsSelected(paramsSelected.filter(p => p !== param))
        : setParamsSelected([...paramsSelected, param])
    }

    const getParametrizedURL = () => {
        return queryString.stringifyUrl({
            url,
            query: paramsSelected.reduce((acc, param) => ({ ...acc, [param]: params[param] }), {})
        });
    }

    const getAllParamKeys = () => Object.keys(params)

    const isAllChecked = () => getAllParamKeys().length === paramsSelected.length;

    const parametrizedURL = getParametrizedURL();

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={open}
            onClose={onClose}>
            <DialogTitle>
                <p>{title}</p>
                <FormControl fullWidth variant="outlined">
                    <OutlinedInput
                        labelWidth={0}
                        disabled
                        value={parametrizedURL}
                        endAdornment={
                            <InputAdornment position="end">
                                <CopyToClipboard text={parametrizedURL}>
                                    <IconButton>
                                        <FilterNone />
                                    </IconButton>
                                </CopyToClipboard>
                            </InputAdornment>
                        }
                        />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        paddingTop: '10px',
                        paddingRight: '30px'
                    }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                checked={isAllChecked()}
                                onChange={handleSelectAll}
                                />
                            }
                            labelPlacement="start"
                            label="All parameters"
                            />
                    </div>
                </FormControl>
            </DialogTitle>
            <DialogContent>
                <List dense>
                    {Object.keys(params).map(param => (
                        <ListItem key={param} button onClick={handleSelectParam(param)}>
                            <ListItemText primary={param} secondary={params[param]} />
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="end"
                                    onChange={handleSelectParam(param)}
                                    checked={paramsSelected.includes(param)}
                                    />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ParametrizedURLDialog
