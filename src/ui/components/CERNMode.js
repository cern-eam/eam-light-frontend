export const isCernMode = import.meta.env.VITE_CERN_MODE === "TRUE";

export const withCernMode = (WrappedComponent) =>
  isCernMode ? WrappedComponent : () => null;

const CERNMode = (props) => (isCernMode ? props.children : null);

export default CERNMode;
