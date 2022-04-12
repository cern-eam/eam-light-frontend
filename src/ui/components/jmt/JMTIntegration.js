import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import { withStyles } from '@material-ui/core/styles';
import EAMInputMUI from 'eam-components/ui/components/inputs/EAMInput';
import EAMLinkInput from "eam-components/ui/components/inputs/EAMLinkInput";
import React from 'react';
import BlockUi from 'react-block-ui';
import WSWorkorders from '../../../tools/WSWorkorders';
import WSJMTIntegration from './WSJMTIntegration';

const FULL_PROCESS_GROUPS = ['MFPLUS'];

const styles = () => ({
    paperWidthSm: {
        width: "700px"
    },
    appBar: {
        backgroundColor: grey[200]
    },
    appBarRoot: {
        boxShadow: 'inherit'
    }
});

// const JMTIntegration = (props) => {
//     const woCode = getURLParameterByName('workordernum');

//     const [data, setData] = useState();
//     useEffect(() => {
//         setData(woCode);
//     }, [woCode]);


//     return <div>Hello World! {data}</div>;
// }
const getLink = ({value, text, baseLink}) =>
    <EAMLinkInput
        value={value}
        isExternalLink={true}
        link={baseLink}
        top={15}>
        <EAMInputMUI
            label={text}
            disabled
            margin="dense"
            value={value}
        />
    </EAMLinkInput>

class JMTIntegration extends React.Component {
    state = {};

    componentDidMount () {
        this.init();
    }

    componentDidUpdate () {
        this.init();
    }

    init () {
        const { loading, loaded } = this.state;
        const { woCode } = this.props;

        if (!loading && !loaded) {
            this.setState({
                loading: true,
                woCode
            });
            WSWorkorders.getWorkOrder(woCode)
                .then(resp => {
                    const wo = resp.body.data;

                    this.setState({
                        loaded: true,
                        loading: false,
                        workOrder: wo,
                        jmtJobNo: wo && wo.userDefinedFields && wo.userDefinedFields.udfchar20
                    })
                })
        }
    }

    createJMTJob (woCode) {
        const { showNotification, handleError } = this.props;
        this.setState({loading: true});
        WSJMTIntegration.createJMTJob(woCode)
            .then(resp => {
                showNotification('Job created');
                this.setState({loading: false, loaded: false})

            })
            .catch(error => {
                this.setState({loading: false, loaded: false})
                handleError(error)
            })
    }

    createJMTJobAndCost (woCode) {
        const { showNotification, handleError } = this.props;
        this.setState({loading: true});

        WSJMTIntegration.createJMTJobAndCost(woCode)
            .then(resp => {
                showNotification('Job created and cost lines added');
                this.setState({loading: false, loaded: false})

            })
            .catch(error => {
                this.setState({loading: false, loaded: false})
                handleError(error)
            })
    }

    addCostLinesToJMTJob (woCode, jmtJobNo, costType) {
        const { showNotification, handleError } = this.props;
        this.setState({loading: true});

        WSJMTIntegration.addCostLines(woCode, jmtJobNo, costType)
            .then(resp => {
                showNotification(`Cost lines of type ${costType} added.`)
                this.setState({loading: false, loaded: false});
            })
            .catch(error => {
                this.setState({loading: false, loaded: false})
                handleError(error)
            })
    }

    render () {
        const { userData, applicationData} = this.props;
        const { loaded, woCode, jmtJobNo, loading } = this.state;
        const isSpecialGroup = FULL_PROCESS_GROUPS.includes(userData.eamAccount.userGroup);
        let component = null;
        if (!loaded) {
            component = <div>Loading...</div>
        } else if (!jmtJobNo){
            component =
                <Button
                    color="primary"
                    onClick={() => isSpecialGroup ? this.createJMTJobAndCost(woCode) : this.createJMTJob(woCode)}
                >
                    Create JMT Job
                </Button>
        } else if (!jmtJobNo.startsWith("J")) {
            component = <div>This work order is already linked to '{jmtJobNo}'.</div>
        } else {
            component = <div>
                    <div style={{width: '280px', paddingLeft: '20px', paddingTop: '10px'}}>
                        {getLink({value: jmtJobNo, text: 'JMT Job', baseLink: 'https://edms5.cern.ch/jmt/plsql/jmtw_job.info?p_job_no='})}
                    </div>
                    <Button
                        color="primary"
                        onClick={() => this.addCostLinesToJMTJob(woCode, jmtJobNo, 'ESTIM')}
                    >
                        Add Cost Estimation
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => this.addCostLinesToJMTJob(woCode, jmtJobNo, 'REAL')}
                    >
                        Add Real Cost
                    </Button>
                </div>;
        }

        return <div style={{margin: 5, padding: 20, height: "100%", overflowY: "scroll"}}>
                <BlockUi tag="div" blocking={loading}>
                    {component}
                </BlockUi>
            </div>


    }
}

export default withStyles(styles)(JMTIntegration);