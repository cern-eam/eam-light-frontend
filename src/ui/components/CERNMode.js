export const isCernMode = process.env.REACT_APP_CERN_MODE === 'TRUE';

const CERNMode = props => isCernMode ? props.children : null;

export default CERNMode;