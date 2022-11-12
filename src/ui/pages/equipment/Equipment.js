import React from 'react';
import {useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import {Route, Switch} from 'react-router-dom';
import EquipmentTree from './components/tree/EquipmentTree'
import Position from "./position/Position";
import Asset from "./asset/Asset";
import System from "./system/System";
import Split from 'react-split'
import Location from './location/Location';
import Workorder from '../work/Workorder';
import { setLayoutProperty } from 'actions/uiActions';
import InstallEqpContainer from './installeqp/InstallEqpContainer';

const Equipment = props => {

    const showEqpTree = useSelector(state =>  state.ui.layout.showEqpTree);
    const equipment = useSelector(state =>  state.ui.layout.equipment);
    const renderEqpTree = equipment && showEqpTree
    const dispatch = useDispatch();
    const setLayoutPropertyConst = (...args) => dispatch(setLayoutProperty(...args));

    useEffect(() => {
        return () => {
                    setLayoutPropertyConst('equipment', null);
                    setLayoutPropertyConst('showEqpTree', false);
                    setLayoutPropertyConst('eqpTreeMenu', null);}
    }, [])

    return (
        <div className="entityContainer">

            <Split sizes={renderEqpTree ? [25, 75] : [0, 100]}
                    minSize={renderEqpTree ? [120, 200] : [0, 300]}
                    gutterSize={renderEqpTree ? 5 : 0}
                    gutterAlign="center"
                    snapOffset={0}
                    style={{display: "flex", width: "100%"}}
            >

                <div style={{height: "100%", flexDirection: "column"}}>
                    {renderEqpTree && <EquipmentTree />}
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

                        <Route path="/workorder/:code(.+)?"
                                component={Workorder}/>

                        <Route path="/installeqp"
                                component={InstallEqpContainer}/>
                    </Switch>
                </div>

            </Split>

        </div>
    )
    

}

export default Equipment;