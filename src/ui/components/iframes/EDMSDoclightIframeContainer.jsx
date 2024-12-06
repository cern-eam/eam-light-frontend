import ComponentIframe from './ComponentIframe';
import { withCernMode } from '../CERNMode';

const EDMSDoclightIframeContainer = (props) => {
    const defaultProps = {
        iframeTitle: 'DOCS',
        mode: 'write',
        profile: 'EAMLIGHT',
        collapsible: false,
        title: '',
        ...props // Allow additional props to override defaults
    };

    return <ComponentIframe {...defaultProps} />;
};

export default withCernMode(EDMSDoclightIframeContainer);
