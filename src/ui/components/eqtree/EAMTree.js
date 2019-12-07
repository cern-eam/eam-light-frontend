import React, {Component} from 'react';
import TreeWS from './lib/TreeWS';
import ErrorTypes from 'eam-components/dist/ui/components/eamgrid/lib/GridErrorTypes';
import {connect} from "react-redux";
import {handleError} from "../../../actions/uiActions";
import SortableTree from 'react-sortable-tree';
import TreeTheme from './theme/TreeTheme';
import TreeIcon from './components/TreeIcon';
import TreeSelectParent from "./components/TreeSelectParent";
import BlockUi from 'react-block-ui';

class EAMTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      lastSearchedNodeIndex: -1,
      treeData: []
    }
  }

  componentDidMount() {
    this._loadTreeData(this.props.code);
  }

  componentWillUnmount() {

  }

  /**
   * Add expanded = true for those nodes that belong to the
   * selected system/code path in the tree
   */
  _expandTreeToCode(treeData, code) {
    if (code && treeData && treeData.length > 0) {
      let nodes = treeData.filter(f => (code == f.id));

      if (nodes.length > 0) {
        nodes[0].expanded = true;
        return true;
      } else {
        return treeData.some(item => {
          const res = this._expandTreeToCode(item.children, code);
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

  _loadTreeData(code) {

    this.setState(() => ({
       loading: true
    }));

    TreeWS.getEquipmentStructure(code)
      .then(data => {

        // get tree data
        let treeData = data.body.data;

        //treeData[0].expanded = true;
        this._expandTreeToCode(treeData, this.props.code);

        this.setState(() => ({
          treeData: treeData,
          loading: false
        }))
      }).catch(error => {
      if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
        this.props.handleError(error);
      }
    });

  }

  _sortableTreeOnChange = (treeData) => {
    this.setState({tree: treeData});
  };

  _isNodeSelected = (node) => {
    return node.id === this.props.code;
  };

  _getURLForType(type) {
    switch(type) {
        case 'A':
            return 'asset';
        case 'P':
            return 'position';
        case 'S':
            return 'system';
    }
  }

  _getColorForType(type) {
    switch(type) {
        case 'A':
            return '#B71C1C';
        case 'P':
            return '#0D47A1';
        default:
            return '#757575';
    }
  }

  render() {
    const {classes} = this.props;

    return (
        <React.Fragment>
      <BlockUi tag="div" blocking={this.state.loading}/>
      <div style={{height: '100%', margin: 5}}>
            <SortableTree
              canDrag={false}
              treeData={this.state.treeData}
              onChange={treeData => this.setState({treeData})}

              // this is to make the tree div height to fit the screen
              //style={{height: '100%'}}
              className='sortableTree'
              // set up our theme
              theme={TreeTheme}

              generateNodeProps={rowInfo => {

                return {
                  isNodeSelected: this._isNodeSelected,
                  onClick: (event) => {
                    if (event.target.className === `rowTitle` && (rowInfo.node.type === 'A' || rowInfo.node.type === 'P' || rowInfo.node.type === 'S')) {
                      if (this.props.history) {
                          this.props.history.push("/" + this._getURLForType(rowInfo.node.type) + `/${rowInfo.node.id}`);
                      }
                    }
                  },
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
                            reloadData={this._loadTreeData.bind(this)}
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
                          color: this._getColorForType(rowInfo.node.type)
                        }}
                      />,
                    ],
                }
              }
              }
            />
      </div></React.Fragment>
    )
  }
}

//EAMTree = withStyles(styles)(EAMTree);

function mapStateToProps(state) {
  return {}
}

EAMTree = connect(mapStateToProps, {
  handleError
})(EAMTree);

export default EAMTree;