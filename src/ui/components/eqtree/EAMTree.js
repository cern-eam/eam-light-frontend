import React, { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom"
import TreeWS from './lib/TreeWS';
import ErrorTypes from 'eam-components/dist/ui/components/eamgrid/lib/GridErrorTypes';
import SortableTree from 'react-sortable-tree';
import TreeTheme from './theme/TreeTheme';
import TreeIcon from './components/TreeIcon';
import TreeSelectParent from './components/TreeSelectParent';
import BlockUi from 'react-block-ui';
import { isMultiOrg } from 'ui/pages/EntityTools';
import { useSelector } from 'react-redux';

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
    const equipment = useSelector(state =>  state.ui.layout.equipment);
    const history = useHistory();

    const { layout, handleError } = props;
    //const { eqpTreeNewChild, eqpTreeNewRoot} = layout;

    const _loadTreeData = async (code, org, type) => {
        setLoading(true);
        try {
            const { body } = await TreeWS.getEquipmentStructure(code, org, type);
            const { data } = body;
            if (treeData) {
                await _reExpandNodes(data);
            }
            setTreeData(data);
            setLoading(false);
        } catch (error) {
            if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                handleError(error);
            }
        }
    };

    // useEffect(() => {
    //     _loadTreeData(code);
    // }, [eqpTreeNewChild, eqpTreeNewRoot]);


    useEffect(() => {
        if (!treeData && equipment) {
            _loadTreeData(equipment.code, equipment.org, equipment.type);
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
        // if (props.layout.eqpTreeCurrentNode) {
        //     return node.id === props.layout.eqpTreeCurrentNode.id;
        // }
        return node.id === equipment.code;
    };


    const nodeClickHandler = (rowInfo) => (event) => {
        if (event.target.className === `rowTitle` && ['A', 'P', 'S', 'L'].includes(rowInfo.node.type)) {
            
            // if (window.location.pathname.includes('installeqp')) {
            //     props.setLayoutProperty('eqpTreeCurrentNode', rowInfo.node);
            //     return;
            // }


            history.push('/' + urlTypeMap[rowInfo.node.type] + `/${rowInfo.node.id}${isMultiOrg ? '%23' + rowInfo.node.idOrg : ''}`);
            
            window.parent.postMessage(
                JSON.stringify({
                    type: 'EQUIPMENT_TREE_NODE_CLICK',
                    node: rowInfo.node,
                }),
                '*'
            );
        }
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
        </>
    );
}
