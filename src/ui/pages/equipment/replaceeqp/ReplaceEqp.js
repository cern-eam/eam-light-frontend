import React, {Component} from 'react';
import BlockUi from 'react-block-ui';
import Grid from '@material-ui/core/Grid';
import ReplaceEqpHierarchy from "./ReplaceEqpHierarchy";
import ReplaceEqpGeneral from "./ReplaceEqpGeneral";
import WSEquipment from "../../../../tools/WSEquipment";
import './ReplaceEqp.css';
import queryString from "query-string";

const MODE_STANDARD = 'Standard';

const initEqpReplacement = {
    oldEquipment: '',
    oldEquipmentDesc:'',
    oldEquipmentStatus: '',
    newEquipment: '',
    newEquipmentDesc: '',
    newEquipmentStatus: 'I',
    replacementMode: MODE_STANDARD
};

class ReplaceEqp extends Component {

    state = {
        replaceEquipment: initEqpReplacement,
        blocking: false,
        statusList: [],
        newEquipment: undefined,
        oldEquipment: undefined
    };

    componentDidMount() {
        //Check URL parameters
        const values = queryString.parse(window.location.search)
        const oldEquipment = values.oldEquipment;
        const newEquipment = values.newEquipment;
        //Get all the properties
        if (oldEquipment) {
            this.updateEqpReplacementProp('oldEquipment', oldEquipment);
        }
        if (newEquipment) {
            this.updateEqpReplacementProp('newEquipment', newEquipment);
        }
    }

    loadStatuses = () => {
        if(!this.state.replaceEquipment.oldEquipment) {
            this.setState(prevState => ({
                statusList: [],
                replaceEquipment: {
                    ...prevState.replaceEquipment,
                    oldEquipmentStatus: ''
                }
            }));
            return;
        }

        const oldEquipmentStatus = this.state.replaceEquipment.oldEquipmentStatus;
        const userGroup = this.props.userData.eamAccount.userGroup;

        //Load list of statuses
        WSEquipment.getEquipmentStatusValues(userGroup, false, oldEquipmentStatus)
            .then(response => {
                const data = response.body.data;
                data.sort(({desc: a}, {desc: b}) => a < b ? -1 : a > b ? 1 : 0);
                this.setState({statusList: data});
        }).catch(error => this.props.handleError(error));
    }

    updateEqpReplacementProp = (key, value) => {
        this.setState((prevState) => ({
            replaceEquipment: {...prevState.replaceEquipment, [key]: value}
        }));
    };

    onChangeOldEquipment = (value) => {
        if (value) {
            this.loadEquipmentData(value, 'oldEquipment');
        } else {
            this.setState({oldEquipment: undefined});
            this.loadStatuses();
        }
    };

    onChangeNewEquipment = (value) => {
        if (value) {
            this.loadEquipmentData(value, 'newEquipment');
        } else {
            this.setState({newEquipment: undefined});
        }
    };

    /**
     * Load the equipment data when it is selected
     * @param code the equipment code
     * @param destination The property destination
     */
    loadEquipmentData = (code, destination) => {
        this.setState({blocking: true});

        //Read equipment
        WSEquipment.getEquipment(code).then(response => {
            const setStateCallback = destination === 'oldEquipment' ?
                this.loadStatuses : undefined;

            this.setState(prevState => {
                const newState = {
                    [destination]: response.body.data, //Set equipment data
                    blocking: false
                };

                //Set status for old equipment
                if(destination === 'oldEquipment') {
                    newState.replaceEquipment = {
                        ...prevState.replaceEquipment,
                        oldEquipmentStatus: response.body.data.statusCode
                    }
                }

                return newState;
            }, setStateCallback);
        }).catch(error => this.setState({blocking: false}));
    };

    replaceEquipmentHandler = () => {
        this.setState({blocking: true});
        //Remove desc properties
        let replaceEquipment = {...this.state.replaceEquipment};
        delete replaceEquipment.oldEquipmentDesc;
        delete replaceEquipment.newEquipmentDesc;
        WSEquipment.replaceEquipment(replaceEquipment)
            .then(response => {
                //Load the new data from old and new equipment
                this.loadEquipmentData(this.state.replaceEquipment.oldEquipment, 'oldEquipment');
                this.loadEquipmentData(this.state.replaceEquipment.newEquipment, 'newEquipment');
                this.props.showNotification(response.body.data);
            })
            .catch(error => this.props.handleError(error))
            .finally(() => this.setState({blocking: false}));
    };

    render() {
        return (
            <div className="entityContainer" >
                <BlockUi tag="div" blocking={this.state.blocking} style={{height: "100%", width: "100%"}}>
                    <div id="entityContent" style={{height: "calc(100% - 70px)"}}>
                        <Grid container spacing={1}>
                            <Grid item sm={6} xs={12}>
                                <ReplaceEqpGeneral replaceEquipment={this.state.replaceEquipment}
                                                   updateProperty={this.updateEqpReplacementProp}
                                                   onChangeOldEquipment={this.onChangeOldEquipment}
                                                   onChangeNewEquipment={this.onChangeNewEquipment}
                                                   equipmentLayout={this.props.equipmentLayout}
                                                   statusList={this.state.statusList}
                                                   replaceEquipmentHandler={this.replaceEquipmentHandler}
                                                   showError={this.props.showError}/>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <ReplaceEqpHierarchy equipment={this.state.oldEquipment} title="CURRENT HIERARCHY OF THE OLD EQUIPMENT"
                                                     equipmentLayout={this.props.equipmentLayout}/>
                                <ReplaceEqpHierarchy equipment={this.state.newEquipment} title="CURRENT HIERARCHY OF THE NEW EQUIPMENT"
                                                     equipmentLayout={this.props.equipmentLayout}/>
                            </Grid>
                        </Grid>
                    </div>
                </BlockUi>
            </div>

        );
    }
}

export default ReplaceEqp;