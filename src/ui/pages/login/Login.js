import React, {Component} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import WS from "../../../tools/WS";
import { Box, Container } from '@mui/material';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';


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

    render() {

        return (
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: 1
                        }}>
                    <Avatar sx={{ m: 1, bgcolor: '#42a5f5' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        EAM Light Login
                    </Typography>
                    <div>
                            <EAMTextField fullWidth required 
                                   value={this.state.INFOR_USER} label="User ID"
                                   onChangeValue = {value => {this.setState({infor_user: value})}}
                                   disabled={this.state.loginInProgress}
                            />

                            <EAMTextField fullWidth required type="password" autoComplete="current-password" 
                                   value={this.state.INFOR_PASSWORD} label="Password"
                                   onChangeValue ={value => {this.setState({infor_password: value})}}
                                   disabled={this.state.loginInProgress}
                            />

                            <EAMTextField fullWidth required label="Organization" uppercase
                                   value={this.state.INFOR_ORGANIZATION}
                                   onChangeValue ={value => {this.setState({infor_organization: value})}}
                                   disabled={this.state.loginInProgress}
                            />

                            <EAMTextField fullWidth required label="Tenant" 
                                       value={this.state.INFOR_TENANT}
                                       onChangeValue ={value => {this.setState({infor_tenant: value})}}
                                       disabled={this.state.loginInProgress}
                            />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={this.loginHandler}
                            disabled={this.state.loginInProgress}
                            sx={{ color: "white", m: "5px", mt: "15px", mb: "20px" }}
                        >
                           LOG IN
                        </Button>
                    </div>
                    </Box>
                </Container>
        )
    }
}

export default Login;
