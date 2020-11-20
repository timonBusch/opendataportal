/**
 * Object for representing informations
 */

SWAC_model = {};
// Storage for actual fetched data
SWAC_model.models = {};

/**
 * Loads data (single or multiple) from the resource.
 * 
 * @param {type} dataRequest Object containing the request data
 * @returns {Promise}
 */
SWAC_model.load = function (dataRequest) {
    // Return promise for loading and initialising the view
    return new Promise((resolve, reject) => {

        dataRequest.requestId = dataRequest.fromName;
        if (dataRequest.fromWheres && dataRequest.fromWheres.id) {
            dataRequest.requestId += '?id=' + dataRequest.fromWheres.id;
        } else if (dataRequest.fromWheres && dataRequest.fromWheres.ooid) {
            dataRequest.requestId += '?ooid=' + dataRequest.fromWheres.ooid;
        }

        // Check if requestor is valid
        if (typeof dataRequest.fromName === 'undefined') {
            reject('DataRequest is invalid. Attribute >fromName< is missing.');
            return;
        }

        // Create capsle to transport data and metadata over the promise border
        let dataCapsle = {
            metadata: {
                fromName: dataRequest.fromName
            }
        };

        // Check if data is requested
        if (typeof dataRequest.fromName === 'undefined') {
            // No data requested, so resolve without data
            resolve(dataCapsle);
        }

        // Check if data is locally available
        if (typeof window[dataRequest.fromName] !== 'undefined') {
            // Convert found data to dataCapsle
            dataCapsle = SWAC_model.convertData(window[dataRequest.fromName], dataCapsle, dataRequest);
            dataCapsle.metadata.fromSource = 'localVariable';
            SWAC_debug.addDebugMessage('model', 'Useing data from global variable for >' + dataRequest.fromName + '<');
        }

        if (typeof dataRequest.requestChunkSize !== 'undefined') {
            SWAC_model.fetchChunk(dataRequest, dataRequest.requestChunkSize, 0).then(
                    function (data) {
                        // Update metadata
                        dataCapsle.metadata.fromSource = remoteHandler.responseMetadata[dataRequest.fromName].url;
                        dataCapsle = SWAC_model.convertData(data, dataCapsle, dataRequest);
                        resolve(dataCapsle);
                    }).catch(function (error) {
                let errmsg;
                if (typeof error.status !== 'undefined') {
                    errmsg = "Could not get data for >" + dataRequest.fromName + "<  Statuscode: " + error.status;
                } else {
                    errmsg = error;
                }

                SWAC_debug.addErrorMessage('model', errmsg, dataRequest);
                reject(error);
            });
        } else {
            // Get data from remote (fetchGet uses data from first datasource that delivers data)
            remoteHandler.fetchGet(dataRequest.fromName, dataRequest.fromWheres, true).then(
                    function (data) {
                        // Update metadata
                        dataCapsle.metadata.fromSource = remoteHandler.responseMetadata[dataRequest.fromName].url;
                        dataCapsle = SWAC_model.convertData(data, dataCapsle, dataRequest);

                        SWAC_debug.addDebugMessage('model', 'Useing data from >' + dataCapsle.metadata.fromSource + '< for >' + dataRequest.fromName + '<');
                        // Link data to models storage
                        SWAC_model.models[dataRequest.id] = dataCapsle;
                        resolve(dataCapsle);
                    }
            ).catch(function (error) {
                // If there is data from global variable or local storage ignore error
                // getting data from datasource
                if (typeof dataCapsle.data !== 'undefined') {
                    // Link data to models storage
                    SWAC_model.models[dataRequest.id] = dataCapsle;
                    // Link date to requestor
                    dataRequest.swac_dataCapsle = dataCapsle;
                    resolve(dataCapsle);
                } else if (typeof error.status !== 'undefined') {
                    if (dataRequest.reportErrors !== false) {
                        let errmsg = "Could not get data for >" + dataRequest.fromName + "<  Statuscode: " + error.status;
                        SWAC_debug.addErrorMessage('model', errmsg, dataRequest);
                    }
                    reject(error);
                } else {
                    let errmsg = "Could not get data for >" + dataRequest.fromName + "<  Error: " + error;
                    SWAC_debug.addErrorMessage('model', errmsg, dataRequest);
                    reject(error);
                }
            });
        }
        ;
    });
};

/**
 * Fetches a chunk of data and recursive the next chunk as long as data is
 * available.
 * 
 * @param {DataRequestor} requestor Requestor specifiing the requested data
 * @param {Integer} requestlimit Maximum number of datasets accuired with one fetch
 * @param {Integer} chunkoffset Id of the dataset where to start fetch
 * @returns {Promise} Promise that resolves with data
 */
SWAC_model.fetchChunk = function (requestor, requestlimit, chunkoffset) {
    return new Promise((resolve, reject) => {
        let chunkData;
        requestor.fromWheres.limit = requestlimit;
        requestor.fromWheres.startset = chunkoffset * requestlimit;
        remoteHandler.fetchGet(requestor.fromName, requestor.fromWheres, true).then(
                function (data) {
                    // Get number of recived datasets
                    let recivedSets = 0;
                    if (data.list) {
                        // Detected as datasets in list format
                        recivedSets = data.list.length;
                    } else if (data.records) {
                        // Detect TreeQL format
                        recivedSets = data.records.length;
                    } else if (typeof data.length !== 'undefined') {
                        // Detected as datastes in array format
                        recivedSets = data.length;
                    } else {
                        // Could not get number of data so this is an object
                        resolve(data);
                    }

                    // When more data is delivered as requested
                    if (recivedSets > requestlimit) {
                        SWAC_debug.addDebugMessage('model', 'REST interface >'
                                + requestor.fromName + '< is not able to handle chunk requests. Delivered all data.');
                        resolve(data);
                    } else if (recivedSets === requestlimit) {
                        // If maximum number of datasets is delivered, check if there is more data
                        chunkData = data;
                        SWAC_debug.addDebugMessage('model', 'Recieved '
                                + recivedSets + ' datasets. Got ' + requestlimit * chunkoffset + ' so far. Getting next chunk.');
                        SWAC_model.fetchChunk(requestor, requestlimit, chunkoffset + 1).then(
                                function (subdata) {
                                    if (chunkData.list) {
                                        chunkData.list = chunkData.list.concat(subdata.list);
                                    } else if(chunkData.records) {
                                        chunkData.records = chunkData.records.concat(subdata.records);
                                    } else if (typeof chunkData.lenght !== 'undefined') {
                                        chunkData = chunkData.concat(subdata);
                                    }
                                    resolve(chunkData);
                                });
                    } else {
                        // If less datasets are delivered than there is no more data
                        SWAC_debug.addDebugMessage('model', 'Recived '
                                + recivedSets + ' datasets. That should be all.');
                        resolve(data);
                    }
                }).catch(function (error) {
            reject(error);
        });
    });
};
/**
 * Converts the recived data into an array of objects that could be understand
 * by SWAC components
 * 
 * @param {Array / Object} data Object or Array of objects with data
 * @param {DataCapsle} dataCapsle Previous defined dataCapsle to store data in
 * @param {DataRequest} dataRequest Object with requestdata for the object
 * @param {Number} idAttr Name of the attribute that stores the id
 * @returns {Object} dataCapsle with added data
 */
SWAC_model.convertData = function (data, dataCapsle, dataRequest, idAttr = 'id') {
    let newdata;
    if (data.list) {
        // Metadata support format
        newdata = data.list;
        // Move other recived values to metadata
        for (let i in data) {
            if (i !== 'list') {
                dataCapsle.metadata[i] = data[i];
            }
        }
    } else if (data.records) {
        // TreeQL format support
        newdata = data.records;
    } else if (Array.isArray(data)) {
        // Raw data formats
        newdata = data;
    } else {
        newdata = [];
        newdata[0] = data;
    }
    // Create dataslot if not exists
    if (!dataCapsle.data)
        dataCapsle.data = [];

    let genid = 0;
    for (let curSet of newdata) {
        if (curSet) {
            let id = curSet[idAttr];
            if (isNaN(id)) {
                id = ++genid;
            }
            // Set default values
            if (dataRequest.swac_comp && dataRequest.swac_comp.options.attributeDefaults
                    && dataRequest.swac_comp.options.attributeDefaults.size > 0) {
                for (let [curAttr, curVal] of dataRequest.swac_comp.options.attributeDefaults) {
                    if (typeof curSet[curAttr] === 'undefined') {
                        curSet[curAttr] = curVal;
                    }
                }
            }
            // Note dataset
            dataCapsle.data[id] = curSet;
        }
    }
    return dataCapsle;
};

/**
 * Gets the value definitions of the values that each dataset in the
 * datasource of this requestor can carry.
 * 
 * @param {DOMElement} defRequestor Element requesting data
 * @returns {Promise} Promise that resolves to an data object with definition
 * information.
 */
SWAC_model.getValueDefinitions = function (defRequestor) {
    return new Promise((resolve, reject) => {
        // Create name of definition interface
        let defIfaceName = SWAC_model.transformSourcename(defRequestor.fromName, 'definition');
        defRequestor.fromName = defIfaceName;

        // Try get model definition from REST interface
        SWAC_model.load(defRequestor).then(
                function (defData) {
                    defRequestor.fromName = defIfaceName;
                    resolve(defData);
                }).catch(
                function (errorObj) {
                    defRequestor.fromName = defIfaceName;
                    SWAC_debug.addErrorMessage('model', 'REST interface >'
                            + defIfaceName
                            + "< does not implement the definition specification.");
                    reject(errorObj);
                });
    });
};

/**
 * Method for saveing data
 * 
 * @param {Object} dataCapsle Casple with data
 * 
 * An data capsle is an object of form;
 * {
 *   data: [
 *      {name:value},
 *      {name:value},
 *      ...
 *   ]
 *   metadata: {
 *      fromSource: 'path where the data was recived from'
 *   }
 * }
 * @param {boolean} supressMessages Supress errormessages generated by the model
 * 
 * @returns {Promise} Returns an promise that resolves with the information
 * deliverd by the save or update REST-interface
 */
SWAC_model.save = function (dataCapsle, supressMessages = false) {
// Return promise for loading and initialising the view
    return new Promise((resolve, reject) => {
        // Build "create" interface resource url
        let fromName = dataCapsle.metadata.fromSource;
        if (typeof fromName === 'undefined') {
            SWAC_debug.addErrorMessage('model', 'fromSource in datacapsle is missing. Check your dataCapsle metadata.');
        }
        let createIfaceName = SWAC_model.transformSourcename(dataCapsle.metadata.fromSource, 'create');
        let updateIfaceName = SWAC_model.transformSourcename(dataCapsle.metadata.fromSource, 'update');

        // Save every dataset
        for (let j in dataCapsle.data) {
            // Check data if it can be converted to number
            for (let attr in dataCapsle.data[j]) {
                let curValue = dataCapsle.data[j][attr];
                if (curValue !== null && curValue !== ''
                        && curValue !== true && curValue !== false) {
                    let num = new Number(dataCapsle.data[j][attr]);
                    if (!isNaN(num)) {
                        dataCapsle.data[j][attr] = num;
                    }
                }
            }

            let leftDatasources = SWAC_config.datasources.length;
            let succseedResponses = [];
            // Check if create or update should be used
            if (typeof dataCapsle.data[j].id === 'undefined' || dataCapsle.data[j].id === '') {
                for (let i in SWAC_config.datasources) {
                    // Get URL for get-requests from datasource
                    let sourceurl = SWAC_config.datasources[i];
                    sourceurl = sourceurl.replace('[fromName]', createIfaceName);
                    SWAC_debug.addDebugMessage('model', 'Sending new data to: ' + sourceurl);
                    // Send request
                    remoteHandler.fetchPost(sourceurl, dataCapsle.data[j], supressMessages).then(
                            function (response) {
                                leftDatasources--;
                                succseedResponses.push(response);
                                if (leftDatasources === 0) {
                                    UIkit.notification({
                                        message: SWAC_language.core.savesuccsess,
                                        status: 'info',
                                        timeout: SWAC_config.notifyDuration,
                                        pos: 'top-center'
                                    });
                                    resolve(succseedResponses);
                                }
                            }
                    ).catch(
                            function (errors) {
                                leftDatasources--;
                                if (leftDatasources === 0) {
                                    if (succseedResponses.length > 0) {
                                        UIkit.notification({
                                            message: SWAC_language.core.savesuccsess,
                                            status: 'info',
                                            timeout: SWAC_config.notifyDuration,
                                            pos: 'top-center'
                                        });
                                        resolve(succseedResponses);
                                    } else {
                                        UIkit.notification({
                                            message: SWAC_language.core.saveerror,
                                            status: 'info',
                                            timeout: SWAC_config.notifyDuration,
                                            pos: 'top-center'
                                        });
                                        reject(errors);
                                    }
                                }
                            }
                    );
                }
            } else {
                for (let i in SWAC_config.datasources) {
                    // Get URL for get-requests from datasource
                    let sourceurl = SWAC_config.datasources[i];
                    sourceurl = sourceurl.replace('[fromName]', updateIfaceName);
                    SWAC_debug.addDebugMessage('model', 'Updateing data to: ' + sourceurl);
                    // Send request
                    remoteHandler.fetchUpdate(sourceurl, dataCapsle.data[j], supressMessages).then(
                            function (response) {
                                leftDatasources--;
                                succseedResponses.push(response);
                                if (leftDatasources === 0) {
                                    if (!supressMessages) {
                                        UIkit.notification({
                                            message: SWAC_language.core.updatesuccsess,
                                            status: 'info',
                                            timeout: SWAC_config.notifyDuration,
                                            pos: 'top-center'
                                        });
                                    }
                                    resolve(succseedResponses);
                                }
                            }
                    ).catch(
                            function (errors) {
                                leftDatasources--;
                                if (leftDatasources === 0) {
                                    if (succseedResponses.length > 0) {
                                        if (!supressMessages) {
                                            UIkit.notification({
                                                message: SWAC_language.core.updatesuccsess,
                                                status: 'info',
                                                timeout: SWAC_config.notifyDuration,
                                                pos: 'top-center'
                                            });
                                        }
                                        resolve(succseedResponses);
                                    }
                                } else {
                                    UIkit.notification({
                                        message: SWAC_language.core.updateerror,
                                        status: 'info',
                                        timeout: SWAC_config.notifyDuration,
                                        pos: 'top-center'
                                    });
                                    reject(errors);
                                }
                            }
                    );
                }
            }
        }
    });
};

/**
 * Method for deleteing data
 * 
 * @param {Object} dataCapsle Casple with data
 * @param {boolean} supressErrorMessages If true automatic generated error messages are supressed.
 * 
 * An data capsle is an object of form;
 * {
 *   data: [
 *      {id:value},
 *      {id:value},
 *      ...
 *   ]
 *   metadata: {
 *      fromSource: 'path where the data was recived from'
 *   }
 * }
 * 
 * @returns {Promise} Returns an promise that resolves with the information
 * deliverd by the delete REST-interface
 */
SWAC_model.delete = function (dataCapsle, supressErrorMessages = false) {
// Return promise for loading and initialising the view
    return new Promise((resolve, reject) => {
        if (!dataCapsle.metadata.fromSource) {
            SWAC_debug.addErrorMessage('model', 'fromSource in datacapsle is missing. Check your dataCapsle metadata.');
        }
        // Get delete interface url
        let deleteIfaceName = SWAC_model.transformSourcename(dataCapsle.metadata.fromSource, 'delete');

        // Delete every dataset
        for (let j in dataCapsle.data) {
            let leftDatasources = SWAC_config.datasources.length;
            let succseedResponses = [];
            // Check if create or update should be used
            if (dataCapsle.data[j].id) {
                for (let i in SWAC_config.datasources) {
                    // Get URL for get-requests from datasource
                    let sourceurl = SWAC_config.datasources[i];
                    sourceurl = sourceurl.replace('[fromName]', deleteIfaceName);
                    SWAC_debug.addDebugMessage('model', 'Deleteing data at: ' + sourceurl);
                    // Send request
                    remoteHandler.fetchDelete(sourceurl, dataCapsle.data[j], supressErrorMessages).then(
                            function (response) {
                                leftDatasources--;
                                succseedResponses.push(response);
                                if (leftDatasources === 0) {
                                    UIkit.notification({
                                        message: SWAC_language.core.deletesuccsess,
                                        status: 'info',
                                        timeout: SWAC_config.notifyDuration,
                                        pos: 'top-center'
                                    });
                                    resolve(succseedResponses);
                                }
                            }
                    ).catch(
                            function (errors) {
                                leftDatasources--;
                                if (leftDatasources === 0) {
                                    if (succseedResponses.length > 0) {
                                        UIkit.notification({
                                            message: SWAC_language.core.deletesuccsess,
                                            status: 'info',
                                            timeout: SWAC_config.notifyDuration,
                                            pos: 'top-center'
                                        });
                                        resolve(succseedResponses);
                                    } else {
                                        UIkit.notification({
                                            message: SWAC_language.core.deleteerror,
                                            status: 'info',
                                            timeout: SWAC_config.notifyDuration,
                                            pos: 'top-center'
                                        });
                                        reject(errors);
                                    }
                                }
                            }
                    );
                }
            } else {
                SWAC_debug.addErrorMessage('model', 'Dataset given to delete has no id.');
            }
        }
    });
};

/**
 * Loads data from a specific source and setid.
 * This function checks if the given source is applicable for single gets, if
 * not (e.g. list-interface) the interface is transformed to get-interface.
 * 
 * @param {String} source Name of the source
 * @param {Integer} setid Id of the requested dataset
 * 
 * @returns {Object} Requested dataset if available
 */
SWAC_model.getFromSourceId = function (source, setid) {
    let ref = 'ref://' + source.replace('/' + SWAC_config.interfaces.list, '/' + SWAC_config.interfaces.get);
    ref = ref.replace('/' + SWAC_config.interfaces.create, '/' + SWAC_config.interfaces.get);
    ref = ref.replace('/' + SWAC_config.interfaces.delete, '/' + SWAC_config.interfaces.get);
    ref += '?id=' + setid;
    return this.getFromReference(ref);
};

/**
 * Resolves an reference to the single element and returns that.
 * 
 * @param {String} reference Reference url (starting with ref://)
 * @return {Promise} Promise that resolves to the data if succsessfull
 */
SWAC_model.getFromReference = function (reference) {
    return new Promise((resolve, reject) => {
        if (reference.indexOf('ref://') !== 0) {
            SWAC_debug.addErrorMessage('model', 'Given string >' + reference + '< is not a valid refernece.');
            return null;
        }

        let dataRequest = {
            fromName: SWAC_model.getSetnameFromRefernece(reference)
        };
        let setid = SWAC_model.getIdFromReference(reference);
        if (setid) {
            dataRequest.fromWheres = {
                id: setid
            };
        }

        SWAC_model.load(dataRequest).then(function (data) {
            resolve(data);
        }).catch(function (error) {
            reject(error);
        });
    });
};

/**
 * Gets the id from the reference string
 * 
 * @param {String} reference Reference string
 * @returns {Long} Number of the referenced object
 */
SWAC_model.getIdFromReference = function (reference) {
    let lastSlashPos = reference.lastIndexOf('/');
    let idrefpart = reference.substring(lastSlashPos);
    let matches = idrefpart.match(/\d+/);
    let numbers = matches.map(Number);
    return numbers[0];
};

/**
 * Gets the setname form the reference string
 * 
 * @param {String} reference Refernece string (ref://)
 * @returns {String} Name of the set the reference points to
 */
SWAC_model.getSetnameFromRefernece = function (reference) {
    let setname;
    if (reference.includes('?')) {
        let lastaskpos = reference.lastIndexOf('?');
        setname = reference.substring(0, lastaskpos);
    } else {
        let lastslashpos = reference.lastIndexOf('/');
        setname = reference.substring(0, lastslashpos);
    }
    setname = setname.replace('ref://', '');
    return setname;
};

/**
 * Transforms the given sourcename to another interface
 * 
 * @param {String} fromName Name of the source
 * @param {String} targetinterface Name of the target interface [get,list,create,update,delete,definition]
 * @returns {String} modified sourceName
 */
SWAC_model.transformSourcename = function (fromName, targetinterface) {
    if (!SWAC_config.interfaces[targetinterface]) {
        //SWAC_debug.addMessage('model', 'Could not transform sourcename configuration is missing interface for >' + targetinterface + '<');
        return fromName;
    }
    // Replaceing for files
    if (fromName.includes('.json')) {
        let lastSlashPos = fromName.lastIndexOf('/');
        fromName = fromName.substring(0, lastSlashPos + 1);
        fromName += targetinterface + '.json';
        return fromName;
    }
    let getIfacePos = fromName.indexOf('/' + SWAC_config.interfaces.get);
    if (getIfacePos > 0) {
        fromName = fromName.substring(0, getIfacePos);
    }
    let lstIfacePos = fromName.indexOf('/' + SWAC_config.interfaces.list);
    if (lstIfacePos > 0) {
        fromName = fromName.substring(0, lstIfacePos);
    }
    let createIfacePos = fromName.indexOf('/' + SWAC_config.interfaces.create);
    if (createIfacePos > 0) {
        fromName = fromName.substring(0, createIfacePos);
    }
    let updateIfacePos = fromName.indexOf('/' + SWAC_config.interfaces.update);
    if (updateIfacePos > 0) {
        fromName = fromName.substring(0, updateIfacePos);
    }
    let deleteIfacePos = fromName.indexOf('/' + SWAC_config.interfaces.delete);
    if (deleteIfacePos > 0) {
        fromName = fromName.substring(0, deleteIfacePos);
    }
    let defIfacePos = fromName.indexOf('/' + SWAC_config.interfaces.definition);
    if (defIfacePos > 0) {
        fromName = fromName.substring(0, defIfacePos);
    }
    return fromName + '/' + SWAC_config.interfaces[targetinterface];
};

/**
 * Creates an reference from an given set
 * 
 * @param {type} set    Set with informations
 * @param {type} setmetadata Metadata about the informations
 * @returns {String}
 */
SWAC_model.getRefeenceForSet = function (set, setmetadata) {
    let ref = 'ref://';
    let fromName = setmetadata.fromName;
    if (fromName.endsWith('/' + SWAC_config.interfaces.list)) {
        fromName = fromName.replace('/' + SWAC_config.interfaces.list, '/' + SWAC_config.interfaces.get);
    }
    ref = ref + fromName + '/' + set.id;

    return ref;
};

/**
 * Resolves an reference to the list interface and gets all data from there
 * 
 * @param {type} reference Reference url (starting with ref://)
 * @returns {undefined}
 */
SWAC_model.getAllFromReference = function (reference) {
    if (reference.indexOf('ref://') !== 0) {
        SWAC_debug.addErrorMessage('model', 'Given string >' + reference + '< is not a valid refernece.');
        return null;
    }

    console.error("not implemented yet.");
};

/**
 * Copys a requestor. If given attributes from the second parameter are 
 * inserted into placeholders whithin the requestors fromWhere clauses.
 * 
 * @param {DataRequestor} dataRequestor DataRequestor source object
 * @param {DOMElement} attrElem DOM Element containing attributes that should be placed in the requestors where clauses
 * @returns {SWAC_model.copyDataRequestor.newRequestor}
 */
SWAC_model.copyDataRequestor = function (dataRequestor, attrElem) {
    // Copy requestor
    let newRequestor = {};
    newRequestor.fromName = dataRequestor.fromName;
    newRequestor.fromWheres = {};
    for (let attr in dataRequestor.fromWheres) {
        newRequestor.fromWheres[attr] = dataRequestor.fromWheres[attr];
    }

    // Replace palceholders in wheres
    for (let curWhereName in newRequestor.fromWheres) {
        let curWhereValue = newRequestor.fromWheres[curWhereName];
        // If its a placeholder
        if (curWhereValue.indexOf('{') === 0) {
            let attrName = curWhereValue.replace('{', '').replace('}', '');
            // Get attr value from element
            let attrValue = attrElem.getAttribute(attrName);
            // Replace placeholder
            newRequestor.fromWheres[curWhereName] = attrValue;
        }
    }

    return newRequestor;
};