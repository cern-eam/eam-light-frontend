import EISPanel from "eam-components/dist/ui/components/panel";

const detailsStyle = {
  backgroundColor: "#fafafa",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
};

const Panel = (props) => {
  return (
    <EISPanel
      {...props}
      detailsStyle={{ ...detailsStyle, ...props.detailsStyle }}
      ExpansionPanelProps={{ elevation: 0, ...props.ExpansionPanelProps }}
    />
  );
};

export default Panel;
