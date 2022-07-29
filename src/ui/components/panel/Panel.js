const { default: EISPanel } = require("eam-components/dist/ui/components/panel")

const detailsStyle = {
    backgroundColor: "#fafafa",
    display: "flex",
    flexWrap: "wrap"
}

const Panel = (props) => {

    return (
        <EISPanel {...props} detailsStyle={detailsStyle} ExpansionPanelProps={{elevation: 0, ...props.ExpansionPanelProps }}/>
    )
}

export default Panel;