import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import EquipmentTree from './components/tree/EquipmentTree'
import Position from "./position/Position";
import Asset from "./asset/Asset";
import System from "./system/System";
import Split from 'react-split'
import Location from './location/Location';

class Equipment extends Component {

    componentWillUnmount() {
        // Removing this property from the store will force the eqp. tree to reinitialize when valid eqp. will be set
        this.props.setLayoutProperty('equipment', null);
        this.props.setLayoutProperty('showEqpTreeButton', false)
    }

    render() {
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
                        {this.props.equipment && this.props.showEqpTree &&
                            <EquipmentTree code={this.props.equipment.code}
                                           org={this.props.equipment.organization}
                                           type={this.props.equipment.systemTypeCode}
                                           history={this.props.history}
                            />
                        }
                    </div>

                    <div style={{backgroundColor: "white", height: "100%", width: "100%"}}>
                        <Switch>
                            <Route path={"/asset/:code(.+)?"}
                                   component={Asset}/>
                            <Route path={"/position/:code(.+)?"}
                                   component={Position}/>
                            <Route path={"/system/:code(.+)?"}
                                   component={System}/>
                            <Route path={"/location/:code(.+)?"}
                                   component={Location}/>
                        </Switch>
                    </div>

                </Split>

            </div>
        )
    }

}

export default Equipment;