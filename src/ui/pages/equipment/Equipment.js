import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import EquipmentTree from './components/tree/EquipmentTree'
import PositionContainer from "./position/PositionContainer";
import AssetContainer from "./asset/AssetContainer";
import SystemContainer from "./system/SystemContainer";
import LocationContainer from "./location/LocationContainer";
import Split from 'split.js'

class Equipment extends Component {

    componentDidMount() {
        if (this.props.showEqpTree) {
            this.initSplitJS()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.showEqpTree && !nextProps.showEqpTree && this.split) {
            this.split.destroy()
        }
        if (!this.props.showEqpTree && nextProps.showEqpTree) {
            this.initSplitJS()
        }
    }

    initSplitJS() {
        this.split = Split([this.tree, this.eqp], {
            gutterSize: 3,
            sizes: [20,80]
        })
    }

    mainDivStyle() {
        return {
            height: "100%",
            minWidth: 300,
            width: 300,
            display: this.props.showEqpTree ? 'flex' : 'none',
            flexDirection: "column"
        }
    }

    componentWillUnmount() {
        // Removing this property from the store will force the eqp. tree to reinitialize when valid eqp. will be set
        this.props.setLayoutProperty('equipment', null)
    }

    render() {
        const equipmentCode = this.props.eqp && this.props.eqp.code || this.props.match.params.code;
        return (
            <div className="entityContainer">

                <div style={this.mainDivStyle()} ref={tree => this.tree = tree}>
                    {equipmentCode &&
                        <EquipmentTree equipmentCode={equipmentCode}
                                       history={this.props.history}
                        />
                    }
                </div>

                    <div ref={eqp => this.eqp = eqp} style={{backgroundColor: "white", height: "100%", width: "100%"}}>
                        <Switch>
                            <Route path={"/asset/:code(.+)?"}
                                   component={AssetContainer}/>
                            <Route path={"/position/:code(.+)?"}
                                   component={PositionContainer}/>
                            <Route path={"/system/:code(.+)?"}
                                   component={SystemContainer}/>
                            <Route path={"/location/:code(.+)?"}
                                   component={LocationContainer}/>
                        </Switch>
                    </div>


            </div>
        )
    }

}

export default Equipment;