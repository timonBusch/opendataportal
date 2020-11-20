var DashboardFactory = {};
DashboardFactory.create = function (config) {
    return new Dashboard(config);
};

/**
 * Sample component for development of own components
 */

class Dashboard extends Component {

    constructor(options) {
        super(options);
        this.componentName = 'Dashboard';
        this.desc.text = 'Dashboard that shows the status of devices from device informations';
        this.desc.templates[0] = {
            name: 'simple',
            style: 'simple',
            desc: 'Simple dashboard'
        };
        this.desc.reqPerTpl[0] = {
            selc: '.swac_dashboard_ownActivityTS',
            desc: 'Element where the timestamp is noted, that is the last activity date/time'
        };
        this.desc.reqPerTpl[1] = {
            selc: '.swac_dashboard_oldestSubActivityTS',
            desc: 'Element where the timestamp is noted, that is oldest activity date/time from this and all subcomponents'
        };
        this.desc.reqPerTpl[2] = {
            selc: '.swac_dashboard_newestSubActivityTS',
            desc: 'Element where the timestamp is noted, that is the newest activity date/time from this and all subcomponents'
        };
        this.desc.reqPerTpl[3] = {
            selc: '.swac_dashboard_acticityState',
            desc: 'Element where the state of collection is noted. If its value contains true the device collects data'
        };
        this.desc.reqPerSet[0] = {
            name: 'name',
            desc: 'Name of the device'
        };
        this.desc.optPerSet[0] = {
            name: 'lastSetFrom', //TODO rename to ts and create possibility for rename in dataset
            desc: 'This is the description of an option'
        };
        this.options.showWhenNoData = true;
        this.desc.opts[0] = {
            name: "activeTimeout",
            desc: "Seconds after which the device is noted as inactive"
        };
        this.options.activeTimeout = 600;
    }

    init() {
        return new Promise((resolve, reject) => {
            let activeTimeoutElem = this.requestor.querySelector('.swac_dashbord_activeTimeout');
            activeTimeoutElem.value = this.options.activeTimeout;

            this.calculateActivityStates();
            resolve();
        });
    }

    /**
     * Calculates the acitivity states for each device
     * 
     * @returns {undefined}
     */
    calculateActivityStates() {
        // Inform about running calculation
        this.requestor.swac_view.insertLoadingElem(this.requestor, 'Calculating activity states...');

        // Get output elems
        let overallElem = this.requestor.querySelector('.swac_dashboard_overall');
        let availElems = this.requestor.querySelectorAll('.swac_dashboard_availCur');
        let inactiveElems = this.requestor.querySelectorAll('.swac_dashboard_inactiveCur');
        // Reset values
        overallElem.innerHTML = '';
        for (let curAvailElem of availElems) {
            curAvailElem.innerHTML = '';
        }
        for (let curInactiveElem of inactiveElems) {
            curInactiveElem.innerHTML = '';
        }

        let overallCollecting = 0;
        let overallInactive = 0;
        // Get repeated elements
        for (let curElem of this.requestor.querySelectorAll('[swac_setid]')) {
            // Get element with collection state
            let collectStateElem = curElem.querySelector('.swac_dashboard_acticityState');
            if (collectStateElem.getAttribute('shouldActive') === 'true') {
                this.addAvailableDevice(curElem.getAttribute('swac_setid'), curElem.getAttribute('swac_setid'));
                overallCollecting++;
                // Get element with calculation base
                let calcBaseElem = curElem.querySelector('.swac_dashboard_ownActivityTS bp');
                if (calcBaseElem) {
                    this.addActivityTS(curElem.getAttribute('swac_setid'), curElem.getAttribute('swac_setid'), calcBaseElem.innerHTML);
                    let setDate = new Date(calcBaseElem.innerHTML);
                    let curDate = new Date();
                    // Calculate difference
                    let timediff = curDate.getTime() - setDate.getTime();
                    // use timeout
                    timediff = timediff - (this.options.activeTimeout * 1000);
                    if (timediff > 0) {
                        overallInactive++;
                        this.addInactiveDevice(curElem.getAttribute('swac_setid'), curElem.getAttribute('swac_setid'));
                        let offSinceElem = curElem.querySelector('.swac_dashboard_offScince');
                        offSinceElem.innerHTML = SWAC_language.Dashboard.offlineSince + ' ';
                        let timediffSeconds = timediff / 1000;
                        if (timediffSeconds > 120) {
                            let timediffMinutes = timediffSeconds / 60;
                            if (timediffMinutes > 60) {
                                let timediffHours = timediffMinutes / 60;
                                if (timediffHours > 24) {
                                    let timediffDays = timediffHours / 24;
                                    offSinceElem.innerHTML += Math.round(timediffDays) + ' ' + SWAC_language.Dashboard.days;
                                } else {
                                    offSinceElem.innerHTML += Math.round(timediffHours) + ' ' + SWAC_language.Dashboard.hours;
                                }
                            } else {
                                offSinceElem.innerHTML += Math.round(timediffMinutes) + ' ' + SWAC_language.Dashboard.minutes;
                            }
                        } else {
                            offSinceElem.innerHTML += Math.round(timediffSeconds)
                                    + ' ' + SWAC_language.Dashboard.seconds;
                        }
                    }
                } else {
                    overallInactive++;
                    this.addInactiveDevice(curElem.getAttribute('swac_setid'), curElem.getAttribute('swac_setid'));
                }
            }
        }
        if (overallCollecting === 0) {
            overallElem.innerHTML = SWAC_language.Dashboard.nocollectingdevices;
        } else {
            let overallPercentage = 100 - (overallInactive / overallCollecting) * 100;
            let overallPercentageF = Math.round(overallPercentage * 100) / 100;
            overallElem.innerHTML = overallPercentageF + ' %';
        }

        this.calculatePercentages();
        this.requestor.swac_view.removeLoadingElem(this.requestor);
    }

    /**
     * Adds an available (sub) device
     * 
     * @param {type} addToId    Id of the device where to add
     * @param {type} deviceId   Id of the device that is added
     * @returns {undefined}
     */
    addAvailableDevice(addToId, deviceId) {
        // Get parent ids elem
        let curElem = this.requestor.querySelector('[swac_setid="' + addToId + '"]');
        if (curElem) {
            let availCurElem = curElem.querySelector('.swac_dashboard_availCur');
            let curCount = availCurElem.innerHTML;
            curCount++;
            availCurElem.innerHTML = curCount;
            // Get parent of parent
            let parentParentId = curElem.getAttribute('swac_parent_setid');
            this.addAvailableDevice(parentParentId, deviceId);
        }
    }

    /**
     * Adds an inactive (sub) device
     * 
     * @param {type} addToId    Id of the device where to add
     * @param {type} deviceId   Id of the device that is added
     * @returns {undefined}
     */
    addInactiveDevice(addToId, deviceId) {
        // Get parent ids elem
        let curElem = this.requestor.querySelector('[swac_setid="' + addToId + '"]');
        if (curElem) {
            let inactiveCurElem = curElem.querySelector('.swac_dashboard_inactiveCur');
            let curCount = inactiveCurElem.innerHTML;
            curCount++;
            inactiveCurElem.innerHTML = curCount;
            // Get parent of parent
            let parentParentId = curElem.getAttribute('swac_parent_setid');
            this.addInactiveDevice(parentParentId, deviceId);
        }
    }

    addActivityTS(addToId, deviceId, lastActivityTS) {
        let curElem = this.requestor.querySelector('[swac_setid="' + addToId + '"]');
        if (curElem !== null) {
            let newKnownDate = new Date(lastActivityTS);
            // Set the oldest subactivity
            let oldestSubActivityTSElem = this.requestor.querySelector('[swac_setid="' + addToId + '"] > .swac_dashboard_oldestSubActivityTS');
            if (oldestSubActivityTSElem === null) {
                oldestSubActivityTSElem = document.createElement('span');
                oldestSubActivityTSElem.classList.add('swac_dashboard_oldestSubActivityTS');
                oldestSubActivityTSElem.innerHTML = lastActivityTS;
                curElem.appendChild(oldestSubActivityTSElem);
            } else if (oldestSubActivityTSElem.innerHTML === '') {
                // If there is no content
                oldestSubActivityTSElem.innerHTML = lastActivityTS;
            } else {
                let lowestKnownDate = new Date(oldestSubActivityTSElem.innerHTML);
                // Compere dates
                if (newKnownDate < lowestKnownDate) {
                    oldestSubActivityTSElem.innerHTML = lastActivityTS;
                }
            }
            // Set the newest subactivity
            let newestSubActivityTSElem = this.requestor.querySelector('[swac_setid="' + addToId + '"] > .swac_dashboard_newestSubActivityTS');
            if (newestSubActivityTSElem === null) {
                newestSubActivityTSElem = document.createElement('span');
                newestSubActivityTSElem.classList.add('swac_dashboard_newestSubActivityTS');
                newestSubActivityTSElem.innerHTML = lastActivityTS;
                curElem.appendChild(newestSubActivityTSElem);
            } else if (newestSubActivityTSElem.innerHTML === '') {
                // If there is no content
                newestSubActivityTSElem.innerHTML = lastActivityTS;
            } else {
                let heighestKnownDate = new Date(newestSubActivityTSElem.innerHTML);
                // Compere dates
                if (newKnownDate > heighestKnownDate) {
                    newestSubActivityTSElem.innerHTML = lastActivityTS;
                }
            }
            // Get parent of parent
            let parentId = curElem.getAttribute('swac_parent_setid');
            if (parentId !== null) {
                this.addActivityTS(parentId, deviceId, oldestSubActivityTSElem.innerHTML);
            }
        }
    }

    /**
     * Calculates the percentages of activity based on the previous calculated
     * active states.
     * 
     * @returns {undefined}
     */
    calculatePercentages() {
        // Get repeated elements
        for (let curElem of this.requestor.querySelectorAll('[swac_setid]')) {
            // Get input and output elements
            let availCurElem = curElem.querySelector('.swac_dashboard_availCur');
            let inactiveCurElem = curElem.querySelector('.swac_dashboard_inactiveCur');
            let curPercentElem = curElem.querySelector('.swac_dashboard_overCur');
            if (availCurElem.innerHTML === '' || availCurElem.innerHTML === '0') {
                curPercentElem.innerHTML = '';
            } else {
                if (availCurElem && inactiveCurElem) {
                    let percentage = 100 - (inactiveCurElem.innerHTML / availCurElem.innerHTML) * 100;
                    let percentageF = Math.round(percentage * 100) / 100;
                    curPercentElem.innerHTML = percentageF;
                }
            }
        }
    }
}