import React, {Component} from 'react'
import InfoPage from '../components/infopage/InfoPage'
import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'
import Ajax from 'eam-components/dist/tools/ajax'
import ErrorTypes from "../../enums/ErrorTypes";
import queryString from "query-string";
import set from "set-value";
import {assignDefaultValues, assignQueryParamValues, assignCustomFieldFromCustomField, assignCustomFieldFromObject, AssignmentType} from './EntityTools';
import WSCustomFields from "../../tools/WSCustomFields";

export default class readEntityEquipment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            layout: {
                blocking: false,
                newEntity: true,
                isModified: false,
                reading: false,
                // the following 2 properties are used for setting the url parameters again after all the
                // requests from the parameterized urls are finished
                requests: 0, // number of requests that we are waiting to complete, also used for unblocking the ui
                assignUrlParams: false // controls whether at the end of all the requests we assign the query params to the entity
            }
        }
        // map of all children components (the children are responsible for registration)
        this.children = {}
    }

    /**
     * Triggered by React. Used to read existing entity or init new one depending on the URL
     *
     * @param nextProps
     */
    componentDidMount() { 
        const values = queryString.parse(window.location.search)
        // If code param is present, open it
        if (values.code) {
            this.props.history.push(this.settings.entityURL + values.code)
            return
        }

        let code = this.props.match.params.code;
        if (code) {
            code = decodeURIComponent(code);
            this.readEntity(code)
        } else {
            this.initNewEntity()
        }

    }

    componentWillUnmount() {
        document.title = "EAM Light";
    }

    /**
     * Triggered by React. Used to read existing entity or init new one depending on the URL
     *
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.key !== this.props.location.key) {
            // Note: code below is trickier than it looks. From testing we have never seen
            // that nextCode !== previousCode, which feels quite strange and unexpected,
            // taking into account that these values change over time
            let nextCode = this.props.match.params.code;
            let previousCode = prevProps.match.params.code;

            if (nextCode && (nextCode !== previousCode)) {
                nextCode = decodeURIComponent(nextCode);
                this.readEntity(nextCode)
            }

            if (!nextCode) {
                this.initNewEntity()
            }
        }
        
        if (this.state.layout.reading) {
            return;
        }

        // if we changed state from waiting for requests to not waiting from requests
        if (this.state.layout.requests === 0 && prevState.layout.requests > 0) {
            // unblock the user interface when all the requests are completed
            this.setLayout({blocking: false});

            // handle the requests that were generated for the parameterized urls feature
            if (!this.state.assignUrlParams) {
                // if there are no more requests to do, reassign the values in the url to the entity
                this.setState(prevState => {
                    const queryParams = queryString.parse(window.location.search);
                    const entity = assignQueryParamValues(prevState[this.settings.entity], queryParams);
                    return {
                        [this.settings.entity]: entity,
                        assignUrlParams: false
                    };
                });
            }

            return;
        }

        const newEntity = this.state[this.settings.entity];
        const oldEntity = {...prevState[this.settings.entity]}; // {...undefined} = {}

        if(typeof newEntity !== 'object') {
            return;
        }

        // create an array of the [key, value] pairs we have to pass to handle the value changing
        const toUpdate = Object.entries(newEntity)
            .filter(([key, value]) => oldEntity[key] !== value && this.settings.handlerFunctions && this.settings.handlerFunctions[key]);

        if (toUpdate.length > 0) {
            // update the count of the requests that we are waiting on
            // note the use of prevLayout to prevent usage of an old incorrect layout state
            this.setLayout(prevLayout => ({requests: prevLayout.requests + toUpdate.length}));

            toUpdate.forEach(([key, value]) => this.handleUpdate(key, value));
        }
    }

    handleUpdate(key, value) {
        // finish the update handling, by decreasing the requests that are waiting to be completed by 1
        // note the use of prevLayout to prevent usage of an old incorrect layout state
        const finish = () => this.setLayout(prevLayout => ({
            requests: prevLayout.requests - 1,
        }));

        const promise = this.settings.handlerFunctions[key](value);

        // all handler functions should return a promise
        // in the case it does not, consider the request finished and do an early exit
        if(!promise) {
            finish();
            return;
        }

        // if we are indeed performing a request, block the user interface
        this.setLayout({blocking: true})

        promise.finally(() => {
            finish();
        });
    }

    /**
     * Initialize new entity
     *
     */
    initNewEntity() {
        // Proceed only when read is allowed
        if (!this.settings.entityScreen) {
            return
        }
        this.resetValidation(this.children)
        this.setLayout({blocking: true});
        this.settings.initNewEntity()
            .then(response => {
                this.setLayout({
                    newEntity: true,
                    blocking: false,
                    isModified: false,
                    // set up the initial values for the parameterized urls request tracking
                    requests: 0, assignUrlParams: true
                })

                // Assign default values
                let entity = this.assignValues(response.body.data);

                // Save to the state
                this.setState({
                    [this.settings.entity]: entity,
                    readError: null
                })

                // Change the window title
                document.title = "New " + this.settings.entityDesc;

                // Invoke entity specific logic on the subclass
                this.postInit()
            })
            .catch(error => {
                this.props.handleError(error);
                this.setLayout({blocking: false});
            })
    }

    /**
     * Read entity identified by 'code'
     *
     * @param code
     */
    readEntity(code) {
        // Proceed only when read is allowed
        if (!this.settings.entityScreen) {
            return
        }
        // Reset all validators when reading new entity
        this.resetValidation(this.children)
        //
        this.setLayout({blocking: true, reading: true});
        //
        if (this.cancelSource) {
            this.cancelSource.cancel();
        }
        this.cancelSource = Ajax.getAxiosInstance().CancelToken.source()
        //
        this.settings.readEntity(code, {cancelToken: this.cancelSource.token})
            .then(response => {
                this.setLayout({
                    newEntity: false,
                    blocking: false,
                    isModified: false,
                    assignUrlParams: false
                })
                this.setState(() => ({
                    [this.settings.entity]: response.body.data,
                     readError: null
                }))
                // Change the window title
                document.title = this.settings.entityDesc + " " + response.body.data[this.settings.entityCodeProperty];
                // Invoke entity specific logic on the subclass
                this.postRead(response.body.data)
                // Disable all children when updates not allowed
                if (!this.settings.entityScreen.updateAllowed) {
                    this.disableChildren()
                }
                this.setLayout({reading: false});
            })
            .catch(error => {
                if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                    let errorMessages = this.props.handleError(error);
                    this.setState({readError: errorMessages})
                }
            })
    }

    /**
     * Update existing entity
     *
     * @param entity
     */
    updateEntity(entity) {
        this.setLayout({blocking: true})
        if (this.preUpdateEntity) {
            entity = {...entity};
            entity = this.preUpdateEntity(entity);
        }
        this.settings.updateEntity(entity)
            .then(response => {
                const entity = response.body.data;
                this.setState(() => ({[this.settings.entity]: entity}));
                this.setLayout({
                    newEntity: false,
                    blocking: false,
                    isModified: false,
                    assignUrlParams: false
                })
                this.props.showNotification(
                    this.settings.entityDesc + ' '
                    + this.state[this.settings.entity][this.settings.entityCodeProperty]
                    + ' has been successfully updated.')
                // Invoke entity specific logic on the subclass
                this.postUpdate(entity)
            })
            .catch(error => {
                this.processError(this.children, error)
                this.props.handleError(error);
                this.setLayout({blocking: false})
            })
    }

    /**
     * Creates new entity
     *
     * @param entity
     */
    createEntity(entity) {
        this.setLayout({blocking: true});
        if (this.preCreateEntity) {
            entity = {...entity};
            entity = this.preCreateEntity(entity);
        }
        this.settings.createEntity(entity)
            .then(response => {
                const createdEntity = response.body.data;
                this.setState(() => ({[this.settings.entity]: response.body.data}));
                //
                this.setLayout({
                    newEntity: false,
                    blocking: false,
                    isModified: false,
                    assignUrlParams: false
                });

                // Set new URL (pushState does not trigger componentDidUpdate)
                window.history.pushState({}, this.settings.entityDesc + ' ' + response.body.data,
                   process.env.PUBLIC_URL + this.settings.entityURL + encodeURIComponent(createdEntity[this.settings.entityCodeProperty]));

                this.props.showNotification(this.settings.entityDesc + ' ' + createdEntity[this.settings.entityCodeProperty] + ' has been successfully created.');
                // Change the window title
                document.title = this.settings.entityDesc + " " + createdEntity[this.settings.entityCodeProperty];

                // Invoke entity specific logic on the subclass
                this.postCreate()
            })
            .catch(error => {
                this.processError(this.children, error);
                this.props.handleError(error);
                this.setLayout({blocking: false})
            })
    }

    /**
     * Delete entity identified by 'code'
     *
     * @param code
     */
    deleteEntity(code) {
        this.setLayout({blocking: true})

        this.settings.deleteEntity(code)
            .then(response => {
                this.props.showNotification(this.settings.entityDesc + ' ' + code + ' has been successfully deleted.')
                this.props.history.push(this.settings.entityURL)
                // Change the window title
                document.title = "New " + this.settings.entityDesc;
            })
            .catch(error => {
                this.props.handleError(error);
                this.setLayout({blocking: false})
            })
    }

    copyEntity() {
        //TODO clean the URL
        let code = this.state[this.settings.entity][this.settings.entityCodeProperty];
        this.setLayout({newEntity: true, reading: true, assignUrlParams: false});
        this.setState({[this.settings.entity]: {
            ...assignDefaultValues(this.state[this.settings.entity],
                                        this.settings.layout,
                                        this.settings.layoutPropertiesMap),
            copyFrom: code}});
        this.postInit();
        if (this.postCopy) {
            this.postCopy();
        }
        this.setLayout({reading: false});
    }

    /**
     *
     */
    saveHandler() {
        // Validate all children and continue when all have passed
        if (!this.validateFields(this.children)) {
            this.props.showError('Several errors have occurred')
            return
        }
        // Create new or update existing entity
        if (this.state.layout.newEntity) {
            this.createEntity(this.state[this.settings.entity])
        } else {
            this.updateEntity(this.state[this.settings.entity])
        }
    }

    //
    // STATE MANIPULATORS
    //
    setLayout(layout) {
        if (typeof layout === 'function') {
            this.setState(prevState => ({
                layout: {
                    ...prevState.layout,
                    ...layout(prevState.layout)
                }
            }));
            return;
        }

        this.setState((prevState) => ({layout: {...prevState.layout, ...layout}}))
    }

    updateEntityProperty = (key, value) => {
        // Form was modified
        this.setLayout({
            isModified: true
        })

        // Set state with the clone of the entity that got the key set
        this.setState((prevState) => ({
                     [this.settings.entity]: set({...prevState[this.settings.entity]}, key, value)
                 }));
    };

    //
    // VALIDATION
    //
    processError(children, error) {
        if (error.response) {
            // Error came from the server
            error.response.body.errors.forEach(error => {
                if (children[error.location]) {
                    children[error.location].setState({
                        error: true,
                        helperText: error.message
                    })
                }
            })
        } else {
            console.log('Error in Entity.processError', error)
        }
    }

    validateFields(children) {
        let validationPassed = true;
        Object.keys(children).forEach(key => {
            if (children[key] && children[key].validate && !children[key].validate()) {
                validationPassed = false
            }
        });
        return validationPassed
    }

    resetValidation(children) {
        Object.keys(children).forEach(key => {
            if (children[key] && children[key].setState) {
                children[key].setState({
                    error: false,
                    helperText: null
                })
            }
        })
    }

    //
    // ASSIGN VALUES
    //
    assignValues(entity) {
        let layout = this.settings.layout;
        let layoutPropertiesMap = this.settings.layoutPropertiesMap;
        let queryParams = queryString.parse(window.location.search);

        entity = assignDefaultValues(entity, layout, layoutPropertiesMap);
        entity = assignQueryParamValues(entity, queryParams);
        return entity;
    }

    //
    // HELPER METHODS
    //
    disableChildren() {
        Object.keys(this.children).forEach(key => {
            this.children[key].disable()
        })
    }

    enableChildren() {
        Object.keys(this.children).forEach(key => {
            this.children[key].enable()
        })
    }

    onKeyDownHandler(event) {
        if (event.keyCode === 13 || event.keyCode === 121) {
            this.saveHandler()
        }
    }

    onChangeClass = newClass => {
        // TODO: refactor how entityCode is retrieved
        const entityCodeMap = {
            workorder: 'EVNT',
            part: 'PART',
            location: 'LOC',
            default: 'OBJ',
        };

        const entityCode = entityCodeMap[this.settings.entity] || entityCodeMap.default;

        return WSCustomFields.getCustomFields(entityCode, newClass).then(response => {
            this.setState(prevState => {
                const entity = prevState[this.settings.entity];
                const newCustomFields = response.body.data;
                let newEntity = assignCustomFieldFromCustomField(entity, newCustomFields, AssignmentType.SOURCE_NOT_EMPTY);
    
                // replace custom fields with ones in query parameters if we just created the entity
                if(!this.state.layout.isModified && this.state.layout.newEntity) {
                    const queryParams = queryString.parse(window.location.search);
                    newEntity = assignCustomFieldFromObject(newEntity, queryParams, AssignmentType.SOURCE_NOT_EMPTY);
                }

                return {
                    [this.settings.entity]: newEntity
                };
            });
        })
    }

    get departmentalSecurity() {
        const { userData } = this.props;
        const { [this.settings.entity]: entity } = this.state;
        return userData.eamAccount.departmentalSecurity[entity.departmentCode] || {};
    }

    //
    // RENDER
    //
    render() {
        if (!this.settings.entityScreen) {
            return <InfoPage title="Access Denied"
                             message={"You seem to have no access to the " + this.settings.entityDesc + " screen."}/>
        }

        if (this.state.readError) {
            return <InfoPage message={this.state.readError}/>
        }

        if (!this.state[this.settings.entity]) {
            return <BlockUi tag="div" blocking={true} style={{height: "100%", width: "100%"}}/>
        }

        // Remove all children before the render (depending on the layout settings fields might have changed)
        this.children = {}

        return (
            <div onKeyDown={this.onKeyDownHandler.bind(this)} tabIndex={0} style={{width: '100%', height: '100%', outline: "none"}}>
                {this.settings.renderEntity()}
            </div>
        )
    }

}
