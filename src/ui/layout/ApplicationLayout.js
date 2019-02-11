import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import FontIcon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from 'mdi-material-ui/Menu'
import './ApplicationLayout.css'
import UserInfoContainer from './UserInfoContainer'
import {FileTree,
        FormatHorizontalAlignLeft,
        FormatHorizontalAlignRight} from 'mdi-material-ui';

class ApplicationLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuCompacted: true,
      mobileMenuActive: false

    };
    this.handleMenuResizeClick = this.handleMenuResizeClick.bind(this);
    this.handleMenuMobileClick = this.handleMenuMobileClick.bind(this);
  }

  handleMenuResizeClick() { 
    this.setState( {
      menuCompacted: !this.state.menuCompacted
    })
  }

  handleMenuMobileClick() { 
    this.setState( {
      mobileMenuActive: !this.state.mobileMenuActive
    })
  }

  handleTreeClick() {
      this.props.setLayoutProperty('showEqpTree', !this.props.showEqpTree)
  }

  maindivClick() {
    if (this.state.menuCompacted && this.state.mobileMenuActive) {
      this.setState({
          mobileMenuActive: false
      })
    }
  }

  render() {
    const headerLinkStyle = {
      color: "white",
      textDecoration: "none",
      fontWeight: 900,
      marginLeft: 15
    }

    const menuIconStyle = {
      display: "inline-block",
      color: "white",
      fontSize: 18
  }  

    return (
      <div id="maindiv" className={(this.state.menuCompacted) ? '' : 'SlimMenu'} onClick={this.maindivClick.bind(this)}>
        <div id="layout-topbar-cover">
          <div id ="layout-topbar-row">
            <div id="layout-topbar-left">
              <Link style={headerLinkStyle} to="/">EAM Light</Link>
            </div>
            <div id="layout-topbar-right">
                <div id="menu-resize-btn">
                  <IconButton onClick={this.handleMenuResizeClick} >
                    {(this.state.menuCompacted) ? (
                      <FormatHorizontalAlignLeft style={menuIconStyle}/>
                    ) : (
                      <FormatHorizontalAlignRight style={menuIconStyle}/>
                    )}
                  </IconButton>
                </div>
                <div id="mobile-menu-btn">
                  <IconButton onClick={this.handleMenuMobileClick}>
                      <Menu style={menuIconStyle}/>
                  </IconButton>
                </div>

                {this.props.showEqpTreeButton &&
                <div id="eqp-tree-btn">
                    <div style={{borderLeft: "1px solid rgba(255, 255, 255, 0.8)", height: 22}}/>
                    <IconButton onClick={this.handleTreeClick.bind(this)}>
                        <FileTree style={menuIconStyle}/>
                    </IconButton>
                </div>}

            </div>

            <UserInfoContainer/>

          </div>
        </div>

        <div id="layout-container">          
          <div id="layout-container-row">
            <div id="layout-menu-cover" className={(this.state.mobileMenuActive) ? 'active' : ''}
                                        onClick={(event) => event.stopPropagation()}>
              {this.props.children[0]}
            </div>

            <div id="layout-portlets-cover">
              {this.props.children[1]}
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

export default ApplicationLayout;