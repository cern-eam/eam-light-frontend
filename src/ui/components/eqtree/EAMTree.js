import React, {useState, useEffect} from 'react';
import TreeWS from './lib/TreeWS';
import ErrorTypes from 'eam-components/dist/ui/components/eamgrid/lib/GridErrorTypes';
import SortableTree from 'react-sortable-tree';
import {addNodeUnderParent} from 'react-sortable-tree'
import TreeTheme from './theme/TreeTheme';
import TreeIcon from './components/TreeIcon';
import TreeSelectParent from "./components/TreeSelectParent";
import BlockUi from 'react-block-ui';

export default function EAMTree(props) {

    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        _loadTreeData(props.code);
    }, [])

    useEffect( () => {
        if (props.layout.eqpTreeNewChild && treeData.length > 0) {
            const currentNode = props.layout.eqpTreeCurrentNode ? props.layout.eqpTreeCurrentNode.id : treeData[0].id
            setTreeData(
                addNodeUnderParent({
                    treeData,
                    parentKey: currentNode,
                    expandParent: true,
                    newNode: props.layout.eqpTreeNewChild,
                    getNodeKey: ({node}) => node.id
                }).treeData
            )
        }
    }, [props.layout.eqpTreeNewChild])

    /**
     * Add expanded = true for those nodes that belong to the
     * selected system/code path in the tree
     */
    const _expandTreeToCode = (treeData, code) => {
        if (code && treeData && treeData.length > 0) {
            let nodes = treeData.filter(f => (code == f.id));

            if (nodes.length > 0) {
                nodes[0].expanded = true;
                return true;
            } else {
                return treeData.some(item => {
                    const res = _expandTreeToCode(item.children, code);
                    if (res) {
                        item.expanded = true;
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
        return false;
    }

    const _loadTreeData = (code) => {
        setLoading(true);

        TreeWS.getEquipmentStructure(code)
            .then(data => {

                // get tree data
                let treeData = data.body.data;
                _expandTreeToCode(treeData, props.code);
                setTreeData(treeData);
                setLoading(false);
            }).catch(error => {
            if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                props.handleError(error);
            }
        });

    }

    const _isNodeSelected = (node) => {
        if (props.layout.eqpTreeCurrentNode) {
            return node.id === props.layout.eqpTreeCurrentNode.id;
        }
        return node.id === props.code;
    };

    const urlTypeMap = {
        'A': 'asset',
        'P': 'position',
        'S': 'system',
        'L': 'location'
    }

    const _getColorForType = (type) => {
        switch (type) {
            case 'A':
                return '#B71C1C';
            case 'P':
                return '#0D47A1';
            default:
                return '#757575';
        }
    }

    const nodeClickHandler = rowInfo => event => {
        if (event.target.className === `rowTitle` && ["A", "P", "S", "L"].includes(rowInfo.node.type)) {
            if (window.location.pathname.includes("installeqp")) {
                props.setLayoutProperty('eqpTreeCurrentNode', rowInfo.node)
                return;
            }

            if (props.history) {
                props.history.push("/" + urlTypeMap[rowInfo.node.type] + `/${rowInfo.node.id}`);
            }
            window.parent.postMessage(JSON.stringify({
                type: 'EQUIPMENT_TREE_NODE_CLICK',
                node: rowInfo.node,
            }), "*");
        }
    }

    return (
        <React.Fragment>
            <BlockUi tag="div" blocking={loading}/>
            <div style={{height: '100%', margin: 5}}>
                <SortableTree
                    canDrag={false}
                    treeData={treeData}
                    onChange={setTreeData}

                    // this is to make the tree div height to fit the screen
                    //style={{height: '100%'}}
                    className='sortableTree'
                    // set up our theme
                    theme={TreeTheme}

                    generateNodeProps={rowInfo => {

                        return {
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
                                    <div className='selectParentButton' style={{marginLeft: '-10px'}}>
                                        {
                                            !rowInfo.parentNode && rowInfo.node.parents && rowInfo.node.parents.length > 0 &&
                                            <TreeSelectParent
                                                parents={rowInfo.node.parents}
                                                reloadData={_loadTreeData}
                                            />
                                        }
                                    </div>,
                                    <TreeIcon
                                        eqtype={rowInfo.node.type}
                                        style={{
                                            width: 15,
                                            height: 15,
                                            marginRight: 5,
                                            marginTop: 3,
                                            color: _getColorForType(rowInfo.node.type)
                                        }}
                                    />,
                                ],
                        }
                    }
                    }
                />
            </div>
        </React.Fragment>
    )
}