import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import EquipmentTree from './components/tree/EquipmentTree'
import PositionContainer from "./position/PositionContainer";
import AssetContainer from "./asset/AssetContainer";
import SystemContainer from "./system/SystemContainer";
import LocationContainer from "./location/LocationContainer";
import Split from 'react-split'
import InstallEqpContainer from "./installeqp/InstallEqpContainer";

class Equipment extends Component {

    componentWillUnmount() {
        this.props.setLayoutProperty('equipment', null);
        this.props.setLayoutProperty('showEqpTreeButton', false);
        this.props.setLayoutProperty('showEqpTree', false);
        this.props.setLayoutProperty('eqpTreeNewChild', null);
        this.props.setLayoutProperty('eqpTreeCurrentNode', null);
    }

    render() {
        const equipmentCode = (this.props.eqp && this.props.eqp.code) || this.props.match.params.code;

        return (
            <div className="entityContainer">

                <Split sizes={this.props.showEqpTree ? [25, 75] : [0, 100]}
                       minSize={this.props.showEqpTree ? [120, 200] : [0, 300]}
                       gutterSize={this.props.showEqpTree ? 5 : 0}
                       gutterAlign="center"
                       snapOffset={0}
                       style={{display: "flex", width: "100%"}}
                >

                    <div style={{height: "100%", flexDirection: "column"}}>
                        {equipmentCode && this.props.showEqpTree &&
                            <EquipmentTree equipmentCode={equipmentCode}
                                           history={this.props.history}
                            />
                        }
                    </div>

                    <div style={{backgroundColor: "white", height: "100%", width: "100%"}}>
                        <Switch>
                            <Route path={"/asset/:code(.+)?"}
                                   component={AssetContainer}/>
                            <Route path={"/position/:code(.+)?"}
                                   component={PositionContainer}/>
                            <Route path={"/system/:code(.+)?"}
                                   component={SystemContainer}/>
                            <Route path={"/location/:code(.+)?"}
                                   component={LocationContainer}/>
                            <Route path="/installeqp"
                                   component={InstallEqpContainer}/>
                        </Switch>
                    </div>

                </Split>

            </div>
        )
    }

}

export default Equipment;