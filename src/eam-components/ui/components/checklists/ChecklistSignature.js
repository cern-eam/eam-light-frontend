import React, { Component } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import WSChecklists from '../../../tools/WSChecklists';
import Grid from '@mui/material/Grid';

const modalStyle = {
    padding: '30px',
    textAlign: 'center',
};

const textStyle = {
    paddingTop: '6px'
}

const signatureTypes = {
    'PB01': 'Performer',
    'PB02': 'Performer 2 (Optional)',
    'RB01': 'Reviewer'
}
export default class ChecklistSignature extends Component {
    constructor(props) {
        super(props);
        this.state = {
          open: false,
          username: null,
          password: null
        };
    }

    onEnter = (ev) => {
        if(ev.key === 'Enter'){ 
            this.sign();
            ev.stopPropagation();
        }
    }

    openDialogue = () => {
        this.setState({open: true});
    };
    
    onUsercodeTextFieldChange = (textField) => {
        this.setState({username: textField.target.value});
    }
    
    onPasswordTextFieldChange = (textField) => {
        this.setState({password: textField.target.value});
    }
    
    closeDialogue = () => {
        this.setState({username: '',
                       password: '',
                       open: false})
    }

    sign = () => {
       const signature = {workOrderCode: this.props.workOrderCode,
                          activityCodeValue: this.props.activityCode,
                          userCode: this.state.username ? this.state.username.toUpperCase() : null,
                          password: this.state.password,
                          signatureType: this.props.signature.type};
        WSChecklists.esignChecklist(signature).then((response)=> { 
            this.props.setSignature(this.props.activityCode, this.props.signature.type, response.body.data.signer, response.body.data.timeStamp);
       }).catch((err)=> {
            this.props.showError(err.response.body.errors[0].message);
        }).finally(this.closeDialogue);
    }

    signatureTypeSwitch(type){
        return signatureTypes[type];
    }


    render() {
        const { signature } = this.props;
        const label = signature.responsibilityDescription ? 
                        signature.responsibilityDescription
                        : signatureTypes[signature.type];

        const dialog =
            <Paper elevation={3} style={modalStyle}>
                <div style={{fontSize:'25px'}}>E-Signature</div>
                <div>
                    <TextField required autoFocus 
                        onChange={this.onUsercodeTextFieldChange} 
                        id='standard-required' 
                        label='Username'
                        autoComplete='off'
                        onKeyDown= {this.onEnter}
                    />
                </div>
                <div>
                    <TextField required 
                        onChange={this.onPasswordTextFieldChange}
                        id='standard-password-input'
                        label='Pasword' 
                        type='password'
                        autoComplete='off'
                        onKeyDown= {this.onEnter}
                    />
                </div>    
                <div> 
                    {<Button type= 'submit' onClick={this.closeDialogue}>
                        Cancel
                    </Button>}
                    {<Button onClick={this.sign} color='primary'> 
                        Sign
                    </Button>}
                </div>
            </Paper> 

        return <div style={{display: 'flex', 
                              alignItems: 'stretch',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              borderTop: '1px dashed rgb(209, 211, 212)',
                              minHeight: '40px',
                              paddingTop: '4px',
                              paddingBottom: '3px'}}>
              <Grid container spacing={1} className="activityDetails">
                <Grid item xs={10} md={10} lg={10} style={{paddingTop: '6px'}}>
                    <label style={{fontSize: '0.84rem', color: 'rgb(20, 88, 134)'}}>{label}</label>
                    <Grid style={{display: 'flex', paddingTop: '2px'}} item xs={10} md={10} lg={10}>  
                        <Grid item xs={6} md={6} lg={6}>{signature.signer}</Grid>
                        <Grid item xs={4} md={4} lg={4}>{signature.time}</Grid>
                    </Grid>
                </Grid>
                    {(signature.viewAsPerformer) &&
                    <Grid item xs={2} md={2} lg={2}>
                        <Button
                            color='primary'
                            onClick={this.openDialogue}
                            disabled={this.props.disabled}
                            style={{
                                paddingTop: '11px',
                                float: 'right'
                            }}>Sign</Button>
                        <Dialog open={this.state.open}>{dialog}</Dialog> 
                    </Grid>}

        </Grid>    
        </div>
    }
}