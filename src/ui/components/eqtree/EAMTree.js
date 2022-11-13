import React, { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom"
import TreeWS from './lib/TreeWS';
import ErrorTypes from 'eam-components/dist/ui/components/eamgrid/lib/GridErrorTypes';
import SortableTree from 'react-sortable-tree';
import TreeTheme from './theme/TreeTheme';
import TreeIcon from './components/TreeIcon';
import TreeSelectParent from './components/TreeSelectParent';
import BlockUi from 'react-block-ui';
import { useSelector, useDispatch } from 'react-redux';
import NodeSelectMenu from './components/NodeSelectMenu';
import { isMultiOrg } from 'ui/pages/EntityTools';
import { handleError, setLayoutProperty } from 'actions/uiActions';

const urlTypeMap = {
    A: 'asset',
    P: 'position',
    S: 'system',
    L: 'location',
  };
  
const _getColorForType = (type) => {
    switch (type) {
        case 'A':
            return '#B71C1C';
        case 'P':
            return '#0D47A1';
        default:
            return '#757575';
    }
};

export default function EAMTree(props) {
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState(null);
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currentRow, setCurrentRow] = React.useState(null);
    
    const equipment = useSelector(state =>  state.ui.layout.equipment);
    const eqpTreeMenu = useSelector(state =>  state.ui.layout.eqpTreeMenu);
    const history = useHistory();

    const dispatch = useDispatch();
    const setLayoutPropertyConst = (...args) => dispatch(setLayoutProperty(...args));
    const handleErrorConst = (...args) => dispatch(handleError(...args));

    const _loadTreeData = async (code, org, type) => {
        setLoading(true);
        try {
            const { body } = await TreeWS.getEquipmentStructure(code, org, type);
            const { data } = body;
            if (treeData) {
                await _reExpandNodes(data);
            }
            setTreeData(data);
        } catch (error) {
            if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                handleErrorConst(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (equipment) {
            _loadTreeData(equipment.code, equipment.organization, equipment.systemTypeCode);
        }
    }, [equipment]);

    const _reExpandNodes = async (newData) => {
        if (newData && newData.length > 0) {
            const expanded = await _getExpanded(treeData[0], []);
            expanded.forEach((ex) => _expandTreeToCode(newData, ex));
        }
    };

    const _getExpanded = async (data, already) => {
        if (data?.expanded) {
            already.push(data.id);
            data.children.forEach((c) => _getExpanded(c, already));
        }
        return already;
    };

    const _expandTreeToCode = (treeData, code) => {
        if (!code || !treeData?.length) {
            return false;
        }
        let nodes = treeData.filter((f) => code == f.id);

        if (nodes.length > 0) {
            nodes[0].expanded = true;
            return true;
        }

        return treeData.some((item) => {
            const res = _expandTreeToCode(item.children, code);
            if (res) {
                item.expanded = true;
                return true;
            } else {
                return false;
            }
        });
    };

    const _isNodeSelected = (node) => {
        if (currentRow) {
            return node.id === currentRow.node.id;
        }
        return node.id === equipment.code;
    };


    const _navigate = (rowInfo) => {

        history.push('/' + urlTypeMap[rowInfo.node.type] + `/${rowInfo.node.id}${isMultiOrg ? '%23' + rowInfo.node.idOrg : ''}`);
        
        window.parent.postMessage(
            JSON.stringify({
                type: 'EQUIPMENT_TREE_NODE_CLICK',
                node: rowInfo.node,
            }),
            '*'
        );
      }


    const nodeClickHandler = (rowInfo) => (event) => {
        
        if (event.target.className === `rowTitle` && ['A', 'P', 'S', 'L'].includes(rowInfo.node.type)) {
            setCurrentRow(rowInfo);

            if (eqpTreeMenu) {
                setAnchorEl(event.currentTarget)
                return;
            }

           _navigate(rowInfo);
            
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
      };

    if (!equipment) {
        return React.Fragment
    }

    return (
        <>
            <BlockUi tag="div" blocking={loading} />
            <div style={{ height: '100%', margin: 5 }}>
                {treeData &&
                    <SortableTree
                        className="sortableTree"
                        canDrag={false}
                        treeData={treeData}
                        onChange={setTreeData}
                        theme={TreeTheme}
                        generateNodeProps={(rowInfo) => ({
                            isNodeSelected: _isNodeSelected,
                            onClick: nodeClickHandler(rowInfo),
                            icons: rowInfo.node.isDirectory
                                ? [
                                    <div
                                        style={{
                                            borderLeft: 'solid 8px red',
                                            borderBottom: 'solid 10px red',
                                            marginRight: 10,
                                            width: 16,
                                            height: 12,
                                            filter: rowInfo.node.expanded
                                                ? 'drop-shadow(1px 0 0 red) drop-shadow(0 1px 0 red) drop-shadow(0 -1px 0 red) drop-shadow(-1px 0 0 red)'
                                                : 'none',
                                            borderColor: rowInfo.node.expanded ? 'white' : 'red',
                                        }}
                                    />,
                                ]
                                : [
                                    <div className="selectParentButton" style={{ marginLeft: -10 }}>
                                        {!rowInfo.parentNode &&
                                            rowInfo.node.parents &&
                                            rowInfo.node.parents.length > 0 && (
                                                <TreeSelectParent
                                                    parents={rowInfo.node.parents}
                                                    setLayoutProperty={setLayoutPropertyConst}
                                                    reloadData={_loadTreeData}
                                                />
                                            )}
                                    </div>,
                                    <TreeIcon
                                        eqtype={rowInfo.node.type}
                                        style={{
                                            width: 15,
                                            height: 15,
                                            marginRight: 5,
                                            marginTop: 3,
                                            color: _getColorForType(rowInfo.node.type),
                                        }}
                                    />,
                                ],
                        })}
                />}
            </div>
            <NodeSelectMenu anchorEl={anchorEl} handleClose={handleClose} currentRow={currentRow} _navigate={_navigate} eqpTreeMenu={eqpTreeMenu}/>
        </>
    );
}
