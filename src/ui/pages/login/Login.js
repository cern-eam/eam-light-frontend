import React, {Component} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import WS from "../../../tools/WS";
import withStyles from '@mui/styles/withStyles';


const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    button: {
        marginTop: theme.spacing.unit * 3,
    },
});


class Login extends Component {

    state = {
        infor_user: "",
        infor_password: "",
        infor_organization: "",
        infor_tenant: "",
        loginInProgress: false,
    }

    constructor(props){
        super(props);
        let inforContextString = sessionStorage.getItem('inforContext')
        if (inforContextString) {
            this.props.updateInforContext(JSON.parse(inforContextString));
        }
    }

    loginHandler = () => {
        // Validate mandatory fields
        if (!this.state.infor_user || !this.state.infor_password || !this.state.infor_organization) {
            this.props.showError("Please provide valid credentials.")
            return;
        }
        // Login
        this.setState({loginInProgress: true})
        WS.login(this.state.infor_user, this.state.infor_password, this.state.infor_organization, this.state.infor_tenant).then(response => {
            let inforContext = {
                INFOR_ORGANIZATION: this.state.infor_organization,
                INFOR_USER: this.state.infor_user.toUpperCase(),
                INFOR_PASSWORD: this.state.infor_password,
                INFOR_TENANT: this.state.infor_tenant,
                INFOR_SESSIONID: response.body.data,
            }
            // Store in the redux store (used by axios)
            this.props.updateInforContext(inforContext)
            // Store in session store (used if page will be refreshed)
            sessionStorage.setItem('inforContext', JSON.stringify(inforContext));
            // Activate all elements again
            this.setState({loginInProgress: false})
        }).catch(error => {
            this.props.handleError(error);
            this.setState({loginInProgress: false})
        })
    }

    onKeyUpHandler = (event) => {
        // Login when enter pressed
        if (event.keyCode === 13) {
            this.loginHandler()
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        EAM Light Login
                    </Typography>
                    <div className={classes.form} onKeyUp={this.onKeyUpHandler}>
                            <TextField autoFocus fullWidth required margin="normal"
                                   value={this.state.INFOR_USER} label="User ID"
                                   onChange = {event => {this.setState({infor_user: event.target.value})}}
                                   disabled={this.state.loginInProgress}
                            />

                            <TextField fullWidth required type="password" autoComplete="current-password" margin="normal"
                                   value={this.state.INFOR_PASSWORD} label="Password"
                                   onChange ={event => {this.setState({infor_password: event.target.value})}}
                                   disabled={this.state.loginInProgress}
                            />

                            <TextField fullWidth required label="Organization" margin="normal"
                                   value={this.state.INFOR_ORGANIZATION}
                                   onChange ={event => {this.setState({infor_organization: event.target.value})}}
                                   disabled={this.state.loginInProgress}
                            />

                            <TextField fullWidth required label="Tenant" margin="normal"
                                       value={this.state.INFOR_TENANT}
                                       onChange ={event => {this.setState({infor_tenant: event.target.value})}}
                                       disabled={this.state.loginInProgress}
                            />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.loginHandler}
                            disabled={this.state.loginInProgress}
                        >
                           LOG IN
                        </Button>
                    </div>
                </Paper>
            </main>
        )
    }
}

export default withStyles(styles)(Login);
