import React from 'react';
import FontIcon from '@material-ui/core/Icon';
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";

const SEARCH_TYPES = {
    PART: {
        text: "Part",
        value: "PART",
        code: "PART",
    },
    EQUIPMENT_TYPES: {
        text: "Equipment",
        value: "A,P,S,L",
        code: "EQUIPMEN",
    },
    JOB: {
        text: "WorkOrder",
        value: "JOB",
        code: "JOB",
    }
}
export default class SearchHeader extends React.Component {

    state = {
        searchOn: Object.values(SEARCH_TYPES).map(v => v.value),
    }

    componentDidMount() {
        this.searchInput.focus();
    }

    renderTypeCheckbox(searchType) {
        const { searchOn, setState } = this.state;
        return <EAMCheckbox
                key={searchType.code}
                elementInfo={{text: searchType.text}}
                value={searchOn.includes(searchType.value).toString()}
                updateProperty={() => {
                    this.setState(
                        {
                            searchOn: searchOn.includes(searchType.value) ?
                            searchOn.filter(val => val !== searchType.value)
                            : [...searchOn, searchType.value]
                        }
                        , () => this.handleSearchInput({target: {value: this.props.keyword}})
                    )
                }}
            />
    }

    render() {
        const searchIconStyle = {
            color: "#02a2f2",
            fontSize: 25,
            position: "absolute",
            right: -4,
            top: 5
        };

        const { showTypes } = this.props;

        return (
            <div id="searchBox" className={this.props.searchBoxUp ? "searchBox searchBoxSearch" : "searchBox searchBoxHome"}>
                <div id="searchBoxLabel" className="searchBoxLabelHome">
                    <img src="images/eamlight_logo.png" alt="EAM Light Logo" style={{paddingLeft: 20}}/>
                    <div style={{width: 10}}></div>
                    <div id="searchBoxLabelGreeting" className={this.props.searchBoxUp ? "searchBoxLabelGreetingSearch" : "searchBoxLabelGreetingHome" }>
                        <span className="FontLatoBlack Fleft Fs30 DispBlock" style={{color: "#02a2f2"}}>Welcome to EAM Light</span>
                    </div>
                </div>
                <div id="searchBoxInput" className={this.props.searchBoxUp ? "searchBoxInputSearch" : "searchBoxInputHome" }>
                    <EAMBarcodeInput updateProperty={this.props.fetchDataHandler} top={3} right={-7}>
                        <input
                            onInput={this.handleSearchInput.bind(this)}
                            id="searchInputText"
                            onKeyDown={this.props.onKeyDown}
                            value={this.props.keyword}
                            style={{textTransform: "uppercase"}}
                            ref={(input) => { this.searchInput = input; }} />
                    </EAMBarcodeInput>
                    <FontIcon style={searchIconStyle} className="fa fa-search"/>
                    {showTypes && <div style={{height: '30px', display: 'flex', direction: 'row'}}>
                       {Object.values(SEARCH_TYPES).map(this.renderTypeCheckbox.bind(this))}
                    </div>}
                    <label id="searchPlaceHolder">{!this.props.keyword && "Search for Equipment, Work Orders, Parts, ..."}</label>
                </div>
            </div>
        );
    }

    handleSearchInput = (event) => {
        this.props.fetchDataHandler(event.target.value, this.state.searchOn.join(','));
    }
}
