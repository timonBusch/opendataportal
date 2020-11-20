/**
 * Class for debugging functions
 * 
 */
var SWAC_debugMessages = new Map();
var SWAC_debugContent = new Map();
class SWAC_debug {

    /**
     * Adds debugging elements to the page
     * 
     * @returns {undefined}
     */
    static addDebuggingElements() {
        let debugAreaButton = document.createElement('button');
        debugAreaButton.id = 'swac_debugButton';
        debugAreaButton.classList.add('uk-button');
        debugAreaButton.classList.add('uk-button-default');
        debugAreaButton.setAttribute('type', 'button');
        debugAreaButton.setAttribute('uk-toggle', 'target: #swac_debugarea');
        debugAreaButton.innerHTML = 'SWAC debugger';

        let debugArea = document.createElement('div');
        debugArea.id = 'swac_debugarea';
        debugArea.setAttribute('uk-offcanvas', 'flip: true');
        let debugAreaDiv = document.createElement('div');
        debugAreaDiv.classList.add('uk-offcanvas-bar');
        // Close button
        let debugAreaCloseBtn = document.createElement('button');
        debugAreaCloseBtn.classList.add('uk-offcanvas-close');
        debugAreaCloseBtn.setAttribute('type', 'button');
        debugAreaCloseBtn.setAttribute('uk-close', 'uk-close');
        debugAreaDiv.appendChild(debugAreaCloseBtn);
        // Headline
        let debugAreaTitle = document.createElement('h3');
        debugAreaTitle.id = 'swac_debugTitle';
        debugAreaTitle.innerHTML = 'SWAC debug area';
        debugAreaDiv.appendChild(debugAreaTitle);
        // Content area
        let debugAreaCont = document.createElement('div');
        debugAreaCont.id = 'swac_debugContent';
        debugAreaDiv.appendChild(debugAreaCont);

        debugArea.appendChild(debugAreaDiv);
        document.body.appendChild(debugAreaButton);
        document.body.appendChild(debugArea);

        // Add "show in debug sidebar" function to each swac requestor
        let swacRequestors = document.querySelectorAll('[swa]');
        for (let curSwacRequestor of swacRequestors) {
            curSwacRequestor.addEventListener('mouseover', SWAC_debug.onMouseOverRequestor);
        }
    }

    /**
     * Function for executing when hovering a requestor. Shows up the debug area.
     * 
     * @param {type} evt
     * @returns {undefined}
     */
    static onMouseOverRequestor(evt) {
        let requestor = evt.target;
        while (!requestor.hasAttribute('swa')) {
            requestor = requestor.parentElement;
        }

        // Set title
        let swacDebugareaTitle = document.querySelector('#swac_debugTitle');
        swacDebugareaTitle.innerHTML = 'Debug >' + requestor.id + '<';
        // Clear content area
        let swacDebugareaDivElem = document.querySelector('#swac_debugContent');
        swacDebugareaDivElem.innerHTML = '';

        // Get requestors messages
        if (typeof SWAC_debugMessages.get(requestor) !== 'undefined') {
            let msgs = SWAC_debugMessages.get(requestor);
            let conts = SWAC_debugContent.get(requestor);
            let msgList = document.createElement('ul');
            msgList.classList.add('uk-list');

            // Add contents
            if (typeof conts !== 'undefined') {
                for (let curCont of conts) {
                    swacDebugareaDivElem.appendChild(curCont);
                    swacDebugareaDivElem.appendChild(document.createElement('hr'));
                }
            }

            // Add errors
            if (msgs['errors'].length > 0) {
                for (let curMsg of msgs['errors']) {
                    let errorsMsg = document.createElement('li');
                    let errorsSymb = document.createElement('img');
                    errorsSymb.setAttribute('src', '/SWAC/swac/components/Icon/imgs/error.svg');
                    errorsSymb.setAttribute('alt', 'Fehler');
                    errorsSymb.setAttribute('style', 'height:15px;width:15px');
                    errorsMsg.appendChild(errorsSymb);
                    errorsMsg.appendChild(document.createTextNode(' ' + curMsg.message));
                    msgList.appendChild(errorsMsg);
                }
            }
            // Add debugs
            if (msgs['debugs'].length > 0) {
                for (let curMsg of msgs['debugs']) {
                    let errorsMsg = document.createElement('li');
                    let errorsSymb = document.createElement('img');
                    errorsSymb.setAttribute('src', '/SWAC/swac/components/Icon/imgs/message_warning.svg');
                    errorsSymb.setAttribute('alt', 'Warnung');
                    errorsSymb.setAttribute('style', 'height:15px;width:15px');
                    errorsMsg.appendChild(errorsSymb);
                    errorsMsg.appendChild(document.createTextNode(' ' + curMsg.message));
                    msgList.appendChild(errorsMsg);
                }
            }
            // Add hints
            if (msgs['hints'].length > 0) {
                for (let curMsg of msgs['hints']) {
                    let errorsMsg = document.createElement('li');
                    let errorsSymb = document.createElement('img');
                    errorsSymb.setAttribute('src', '/SWAC/swac/components/Icon/imgs/message_heart.svg');
                    errorsSymb.setAttribute('alt', 'Empfehlung');
                    errorsSymb.setAttribute('style', 'height:15px;width:15px');
                    errorsMsg.appendChild(errorsSymb);
                    let msgContElem = document.createElement('div');
                    msgContElem.innerHTML = curMsg.message;
                    errorsMsg.appendChild(msgContElem);
                    msgList.appendChild(errorsMsg);
                }
            }

            swacDebugareaDivElem.appendChild(msgList);
        } else {
            swacDebugareaDivElem.innerHTML = 'There are no messages for requestor >' + requestor.id + '<';
        }

        let swacDebugareaElem = document.querySelector('#swac_debugarea');
//        UIkit.offcanvas(swacDebugareaElem).show();
    }

    /**
     * Adds any HTML content to the debug display.
     * 
     * @param {DOMElement} requestor Requestor for wich the content aplies
     * @param {DOMElement} content DOMElement with content
     * @returns {undefined}
     */
    static addDebugContent(requestor, content) {
        if (SWAC_config.debugmode) {
            if (!SWAC_debugContent.has(requestor)) {
                SWAC_debugContent.set(requestor, []);
            }
            // Get old contents
            let cont = SWAC_debugContent.get(requestor);
            cont.push(content);
            SWAC_debugContent.set(requestor, cont);
        }
    }

    /**
     * Adds a message to the message store
     * @param {type} component Component which reports
     * @param {type} message Message reported
     * @param {type} element Element the message belongs to (usualy a SWAC requestor)
     * @param {type} level Messages level (error, debug, hint)
     * @returns {undefined}
     */
    static addMessage(component, message, element, level) {
        // Add message to map
        if (typeof SWAC_debugMessages.get(element) === 'undefined') {
            let msgContainer = {
                errors: [],
                debugs: [],
                hints: []
            };
            SWAC_debugMessages.set(element, msgContainer);
        }
        SWAC_debugMessages.get(element)[level + 's'].push({
            component: component,
            message: message
        });
        if (element instanceof HTMLElement)
            element.classList.add('swac_' + level + 'msg');
    }

    /**
     * Adds an error message to console and to the effected element if given.
     * 
     * @param {String} component Name of the component where to log from 
     * @param {String} message Message to display
     * @param {DOMElement} element Element the error is realated to
     * @returns {undefined}
     */
    static addErrorMessage(component, message, element) {
        let msg = 'SWAC ERROR (' + component + '): ' + message;
        let consolemsg = msg;
        if (typeof element !== 'undefined') {
            consolemsg = consolemsg + ' for requestor: ' + element.id;
        }
        console.error(consolemsg);

        SWAC_debug.addMessage(component, message, element, 'error');
    }
    /**
     * Adds an debug message to console and to the effected element if given.
     * 
     * @param {String} component Name of the component where to log from 
     * @param {String} message Message to display
     * @param {DOMElement} element Element the error is realated to
     * @returns {undefined}
     */
    static addDebugMessage(component, message, element) {
        if (SWAC_config.debugmode) {
            let msg = 'SWAC DEBUG (' + component + '): ' + message;
            let consolemsg = msg;
            if (typeof element !== 'undefined') {
                consolemsg = consolemsg + ' for requestor: ' + element.id;
            }
            console.log(consolemsg);

            SWAC_debug.addMessage(component, message, element, 'debug');
        }
    }
    /**
     * Adds an hint message to console and to the effected element if given.
     * 
     * @param {String} component Name of the component where to log from 
     * @param {String} message Message to display
     * @param {DOMElement} element Element the error is realated to
     * @returns {undefined}
     */
    static addHintMessage(component, message, element) {
        if (SWAC_config.hintmode) {
            let msg = 'SWAC HINT (' + component + '): ' + message;
            let consolemsg = msg;
            if (typeof element !== 'undefined') {
                consolemsg = consolemsg + ' for requestor: ' + element.id;
            }
            console.log(consolemsg);

            SWAC_debug.addMessage(component, message, element, 'hint');
        }
    }
    /**
     * Prints an hint message, that shows the available options for that component
     * 
     * @param {DOMElement} requestor
     * @returns {undefined}
     */
    static addOptionsHintMessage(requestor) {
        if (SWAC_config.hintmode) {
            // Check if custom options are used
            if (requestor.optionsSource) {
                SWAC_debug.addDebugMessage('debug',
                        requestor.swac_comp.componentName + ' for ' + requestor.id
                        + ' runs with custom options', requestor);
                return;
            }

            // Create example configuration
            let globalOptionsVarName = requestor.id + '_options';
            let optionsDescription = '<pre><code class="lang-javascript">';
            optionsDescription += 'var ' + globalOptionsVarName + ' = {';
            let count = 0;
            for (let i in requestor.swac_comp.options) {
                let curOption = requestor.swac_comp.options[i];
                optionsDescription += "\r\n  " + i + ' : ';
                if(typeof curOption === "boolean"
                        || typeof curOption === "numeric") {
                    optionsDescription += curOption + ',';
                } else if(Array.isArray(curOption)) {
                    optionsDescription += "[";
                    for(let j in curOption) {
                        optionsDescription += curOption[j];
                        if(j < curOption.length-1)
                            optionsDescription += ",";
                    }
                    optionsDescription += "],";
                } else if(typeof curOption === "object") {
                    optionsDescription += "{";
                    for(let attr in curOption) {
                        optionsDescription += "\r\n  " + attr + ":" + curOption + ",";
                    }
                    optionsDescription += "\r\n  },";
                } else {
                    optionsDescription += "'" + curOption + "',";
                }
                count++;
            }
            optionsDescription += '\r\n\};</code></pre>';
            if (count > 0) {
                let msg = 'You can set custom options for >' + requestor.id
                        + '< by defining a global object named >' + globalOptionsVarName
                        + '<'
                        + '<br> example:'
                        + optionsDescription;

                SWAC_debug.addMessage('debug', msg, requestor, 'hint');
            }
        }
    }

    /**
     * Checks all requirements
     * 
     * @param {DOMElement} requestor SWAC requestor for checking
     * @returns Array with violated requirements
     */
    static checkRequirements(requestor) {
        let comp = requestor.swac_comp;
        // check if component has description
        if (typeof comp.desc === 'undefined') {
            SWAC_debug.addDebugMessage(comp.componentName, 'The component >'
                    + comp.componentName + ' does not have SWAC descriptions. '
                    + 'Can not check requirements.', requestor);
            return;
        }

        let violations = SWAC_debug.checkDataRequirements(requestor);
        violations = SWAC_debug.checkTplRequirements(requestor, violations);

        return violations;
    }
    /**
     * Checks if the requestor violats template requirements
     * 
     * @param {DOMElement} requestor SWAC requestor element
     * @param {Array} violations Array where to store violations
     * @returns Array with all violations
     */
    static checkDataRequirements(requestor, violations = []) {
        let comp = requestor.swac_comp;
        // check if component has description
        if (typeof comp.desc === 'undefined' || typeof comp.desc.reqPerSet === 'undefined') {
            // Component does not have data requirements
            return violations;
        }

        let data = requestor.swac_comp.data;

        // Check if there are requirements for datasets
        if (typeof comp.desc.reqPerSet !== 'undefined') {
            for (let curReq of comp.desc.reqPerSet) {
                // check each dataset
                for (let i in data) {
                    let curSet = data[i];
                    //TODO check on * that means: a non previous used attribute must be there
                    if (curReq.name !== '*' && typeof curSet[curReq.name] === 'undefined') {
                        // Add requirement validation
                        let violation = {
                            setno: i,
                            req: curReq
                        };
                        violations.push(violation);
                        // Add violation message
                        SWAC_debug.addErrorMessage(comp.componentName,
                                'The required attribute >' + curReq.name
                                + '< is missing in datasource >' + requestor.fromName
                                + '<'
                                , requestor);
                    }
                }
            }
        }
        return violations;
    }
    /**
     * Checks if the requestor violats template requirements
     * 
     * @param {DOMElement} requestor SWAC requestor element
     * @param {Array} violations Array where to store violations
     * @returns Array with all violations
     */
    static checkTplRequirements(requestor, violations = []) {
        let comp = requestor.swac_comp;
        // check if component has description
        if (typeof comp.desc === 'undefined') {
            SWAC_debug.addDebugMessage(comp.componentName, 'The component >'
                    + comp.componentName + ' does not have SWAC descriptions. '
                    + 'Can not check requirements.', requestor);
            return violations;
        }

        // Check if there are requirements for templates
        if (typeof comp.desc.reqPerTpl !== 'undefined') {
            for (let curReq of comp.desc.reqPerTpl) {
                let selectedElem = requestor.querySelector(curReq.selc);
                if (selectedElem === null) {
                    violations.push(curReq);
                }
            }
        }
        return violations;
    }
}