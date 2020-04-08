import React, {Component} from 'react'
import InfoPage from '../components/infopage/InfoPage'
import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'
import Ajax from 'eam-components/dist/tools/ajax'
import ErrorTypes from "../../enums/ErrorTypes";
import queryString from "query-string";
import set from "set-value";

export default class readEntityEquipment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            layout: {
                blocking: false,
                newEntity: true,
                isModified: false
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

    /**
     * Triggered by React. Used to read existing entity or init new one depending on the URL
     *
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        // Execute only when the URL was 'pushed'
        if (prevProps.location.key !== this.props.location.key) {
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
                    isModified: false
                })

                // Assign default values
                let entity = this.assignValues(response.body.data);

                // Save to the state
                this.setState({
                    [this.settings.entity]: entity,
                    readError: null
                })

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
        this.setLayout({blocking: true})
        //
        if (this.cancelSource) {
            this.cancelSource.cancel();
        }
        this.cancelSource = Ajax.getAxiosInstance().CancelToken.source()
        //
        this.settings.readEntity(code, {cancelToken: this.cancelSource.token})
            .then(response => {
                this.setState(() => ({
                    [this.settings.entity]: response.body.data,
                     readError: null
                }))
                this.setLayout({
                    newEntity: false,
                    blocking: false,
                    isModified: false
                })
                // Invoke entity specific logic on the subclass
                this.postRead(response.body.data)
                // Disable all children when updates not allowed
                if (!this.settings.entityScreen.updateAllowed) {
                    this.disableChildren()
                }
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
                this.setState(() => ({[this.settings.entity]: response.body.data}));
                this.setLayout({
                    newEntity: false,
                    blocking: false,
                    isModified: false
                })
                this.props.showNotification(
                    this.settings.entityDesc + ' '
                    + this.state[this.settings.entity][this.settings.entityCodeProperty]
                    + ' has been successfully updated.')
                // Invoke entity specific logic on the subclass
                this.postUpdate()
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
                    isModified: false
                });

                // Set new URL (pushState does not trigger componentDidUpdate)
                window.history.pushState({}, this.settings.entityDesc + ' ' + response.body.data,
                   process.env.PUBLIC_URL + this.settings.entityURL + encodeURIComponent(createdEntity[this.settings.entityCodeProperty]));

                this.props.showNotification(this.settings.entityDesc + ' ' + createdEntity[this.settings.entityCodeProperty] + ' has been successfully created.');
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
            })
            .catch(error => {
                this.props.handleError(error);
                this.setLayout({blocking: false})
            })
    }

    copyEntity() {
        //TODO clean the URL
        let code = this.state[this.settings.entity][this.settings.entityCodeProperty];
        this.setLayout({ newEntity: true });
        this.setState({[this.settings.entity]: {
            ...this.assignDefaultValues(this.state[this.settings.entity],
                                        this.settings.layout,
                                        this.settings.layoutPropertiesMap),
            copyFrom: code}});
        this.postInit();
        if (this.postCopy) {
            this.postCopy();
        }
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
        return this.assignQueryParamValues(this.assignDefaultValues(entity, layout, layoutPropertiesMap), queryParams)
    }

    assignQueryParamValues(entity, queryParams) {
        // Populate the entity object with query params keys matching the custom field code
        if (entity.customField) {
            entity.customField.filter(cf => queryParams[cf.code]).forEach(cf => cf.value = queryParams[cf.code])
        }

        // Create an entity-like object with the values from the query parameters
        let queryValues = Object.keys(queryParams).reduce( (result, qkey) => {
            if (qkey.startsWith("udf")) {
                set(result, `userDefinedFields.${qkey}`, queryParams[qkey])
            } else {
                // Transform the query key (qkey) to match exactly the key name in the entity (ekey)
                result[Object.keys(entity).find(ekey => ekey.toUpperCase() === qkey.toUpperCase())] = queryParams[qkey];
            }
            return result;
        }, {})
        delete queryValues.undefined;

        return {
            ...entity,
            ...queryValues,
            userDefinedFields: {
                ...entity.userDefinedFields,
                ...queryValues.userDefinedFields
            }
        }
    }

    assignDefaultValues(entity, layout, layoutPropertiesMap) {
        // Create an entity-like object with the default values from the screen's layout
        let defaultValues = {};
        if (layout && layoutPropertiesMap) {
            defaultValues = Object.values(layout.fields)
                .filter(field => field.defaultValue && layoutPropertiesMap[field.elementId])
                .reduce((result, field) => set(result, layoutPropertiesMap[field.elementId], field.defaultValue === 'NULL' ? '' : field.defaultValue), {})
        }

        return {
            ...entity,
            ...defaultValues,
            userDefinedFields: {
                ...entity.userDefinedFields,
                ...defaultValues.userDefinedFields
            }
        }
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
