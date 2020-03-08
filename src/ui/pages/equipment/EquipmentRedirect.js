import React, {Component} from 'react';
import BlockUi from 'react-block-ui';
import InfoPage from "../../components/infopage/InfoPage";
import WSEquipment from "../../../tools/WSEquipment";

/**
 * This component will handle the redirection to the proper equipment page, according to the type of equipment
 */
class EquipmentRedirect extends Component {

    state = {
        isLoading: true,
        isValidCode: false
    };

    blockUiStyle = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    blockUiStyleDiv = {
        display: "flex",
        height: 60, alignItems: "flex-end"
    };

    componentDidMount() {
        let code = this.props.match.params.code;
        this.loadEquipmentData(code);
    }

    componentWillReceiveProps(nextProps) {
        let code = nextProps.match.params.code;
        this.loadEquipmentData(code);
    }

    loadEquipmentData = (code) => {
        if (code) {
            code = decodeURIComponent(code);
            //Set loading
            this.setState(() => ({
                isLoading: true
            }));
            //Fetch the equipment
            WSEquipment.getEquipment(code).then(response => {
                const equipment = response.body.data;
                //Valid code
                this.setState(() => ({
                    isLoading: false,
                    isValidCode: true,
                }));
                //Redirect according to the typeCode
                switch (equipment.typeCode) {
                    case 'A':
                        this.props.history.replace(`/asset/${code}`);
                        break;
                    case 'P':
                        this.props.history.replace(`/position/${code}`);
                        break;
                    case 'S':
                        this.props.history.replace(`/system/${code}`);
                        break;
                    case 'L':
                        this.props.history.replace(`/location/${code}`);
                        break;
                    default: /*Not supported*/
                        this.setState(() => ({
                            isLoading: false,
                            isValidCode: false,
                        }));
                }
            }).catch(error => {
                //Not valid code
                this.setState(() => ({
                    isLoading: false,
                    isValidCode: false,
                }));
            })
        } else {
            //There is not valid code
            this.setState(() => ({
                isLoading: false,
                isValidCode: false,
            }));
        }
    };


    render() {
        //If its loading, show the app loading
        if (this.state.isLoading) {
            return (
                <BlockUi tag="div" blocking={true} style={this.blockUiStyle}>
                    <div style={this.blockUiStyleDiv}>Loading Equipment ...</div>
                </BlockUi>
            );
        }

        //Check if it is a valid code
        if (!this.state.isValidCode) {
            return <InfoPage title="Invalid Equipment"
                             message="The provided code is not a valid Equipment. [Asset, Position, System]"/>
        }

        //Valid code
        return <div/>;
    }
}

export default EquipmentRedirect;