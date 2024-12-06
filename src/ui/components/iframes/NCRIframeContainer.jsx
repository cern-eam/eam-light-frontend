import ComponentIframe from './ComponentIframe';
import { withCernMode } from '../CERNMode';

const NCRIframeContainer = (props) => {
    const defaultProps = {
        mode: 'write',
        profile: 'EAMLIGHT',
        creationMode: 'NCR',
        options: {
            heightCalculationMethod: 'taggedElement',
        },
        ...props // Allow additional props to override defaults
    };

    return <ComponentIframe {...defaultProps} />;
};

export default withCernMode(NCRIframeContainer);
