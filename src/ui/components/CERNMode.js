const CERNMode = props => process.env.REACT_APP_CERN_MODE === 'TRUE' ? props.children : null;

export default CERNMode;