export const isCernMode = process.env.REACT_APP_CERN_MODE === 'TRUE';

export const withCernMode = WrappedComponent => isCernMode ? WrappedComponent : () => null;

const CERNMode = props => isCernMode ? props.children : null;

export default CERNMode;