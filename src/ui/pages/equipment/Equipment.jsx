import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import EquipmentTree from "./components/tree/EquipmentTree";
import Position from "./position/Position";
import Asset from "./asset/Asset";
import NCR from "./ncr/NCR";
import System from "./system/System";
import Split from "react-split";
import Location from "./location/Location";
import Workorder from "../work/Workorder";
import InstallEqp from "./installeqp/InstallEqp";
import useEquipmentTreeStore from "../../../state/useEquipmentTreeStore";

const Equipment = () => {
  const {equipmentTreeData: {showEqpTree, equipment}, updateEquipmentTreeData} = useEquipmentTreeStore();
  const renderEqpTree = equipment && showEqpTree;

  useEffect(() => {
    return () => {
      updateEquipmentTreeData({
        equipment: null,
        eqpTreeMenu: null,
      })
    };
  }, []);

  return (
    <div className="entityContainer">
      <Split
        sizes={renderEqpTree ? [25, 75] : [0, 100]}
        minSize={renderEqpTree ? [120, 200] : [0, 300]}
        gutterSize={renderEqpTree ? 5 : 0}
        gutterAlign="center"
        snapOffset={0}
        style={{ display: "flex", width: "100%" }}
      >
        <div style={{ height: "100%", flexDirection: "column" }}>
          {renderEqpTree && <EquipmentTree />}
        </div>

        <div
          style={{ backgroundColor: "white", height: "100%", width: "100%" }}
        >
          <Switch>
            <Route path={"/asset/:code(.+)?"} component={Asset} />
            <Route path={"/ncr/:code(.+)?"} component={NCR} />
            <Route path={"/position/:code(.+)?"} component={Position} />
            <Route path={"/system/:code(.+)?"} component={System} />
            <Route path={"/location/:code(.+)?"} component={Location} />
            <Route path="/workorder/:code(.+)?" component={Workorder} />
            <Route path="/installeqp" component={InstallEqp} />
          </Switch>
        </div>
      </Split>
    </div>
  );
};

export default Equipment;
