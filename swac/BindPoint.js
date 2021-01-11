class BindPoint extends HTMLElement {

    constructor(attrName) {
        super();
        if (!attrName && !this.getAttribute('attrName')) {
            SWAC_debug.addErrorMessage('BindPoint', 'BindPoint needs a attrName!');
        }
        if (attrName) {
            this.setAttribute('attrName', attrName);  // Name of the bindpoint (e.g. the values name)
        }
        this.element = null;    // Element this bindpoint belongs to (only if not self element)
        this.attribute = null;  // Name of the attribute this bindpoint belongs to
        this.val = null;        // Value that the bindpoint displays
        this.startcont = null;  // Content before first insert
        this.set = null;        // Dataset this bindpoint belongs to
        this.observers = [];    // List of objects that should be notified on value change
    }

    /**
     * Adds an observer to the bindpoint
     * 
     * @param {Object} observer Object that is nitificable with a notify() function.
     * @returns {undefined}
     */
    addObserver(observer) {
        if (typeof observer.notify !== 'function') {
            SWAC_debug.addErrorMessage('BindPoint', 'The object added has no notify function.');
            return;
        }
        // Prevent use observer more than one time
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            observer.notify(this.attrName, this.value);
        }
    }

    /**
     * Recives notifications from the dataset if that changes
     * 
     * @param {String} attrNameFor Name of the attribute that changes
     * @param {Object} value Value of the changed attribute
     * @returns {undefined}
     */
    notify(attrNameFor, value) {
        SWAC_debug.addDebugMessage('BindPoint',
                'Notification about new value >' + value + '< for >' + attrNameFor
                + '< recived.');
        // Check if value is relative url
        if (value !== null && SWAC_config.swac_root.startsWith('/')
                && typeof value !== 'undefined'
                && typeof value.startsWith === 'function'
                && !value.includes('://')
                && !value.startsWith('/')
                && value.includes('/')
                && !value.includes(' ')
                && !value.includes('data:application/octet-stream')
                ) {
            value = SWAC_config.swac_root + '/' + value;
        }

        //Update displayed data
        this.value = value;
    }

    /**
     * Seter for lazy-databinding, should be placed on each data-object for databinding
     * 
     * @param {Object} value    New value of the attribute
     * @returns {undefined}
     */
    set value(value) {
        // Avoid resetting same value
        if (this.val === value) {
            return;
        }

        this.val = value;
        let attrName = this.getAttribute('attrName');
        // Update displayed data
        if (this.attribute) {
            // Update attribute value
            if (typeof value === 'undefined') {
                this.element.removeAttribute(this.attribute);
            } else {
                let cont = this.startcont.replace('{' + attrName + '}', value);
                cont = cont.replace('\{\*\}', value);
                this.element.setAttribute(this.attribute, cont);
            }
        } else {
            // Update tag value
            if (typeof value === 'undefined') {
                this.innerHTML = '';
            } else {
                this.innerHTML = value;
            }
        }

        // inform observers
        for (let curObserver of this.observers) {
            curObserver.notify(attrName, value);
        }
    }

    get value() {
        return this.val;
    }

    /**
     * Sets the dataset for this bindpoint. Also sets the value from the dataset.
     * 
     * @param {Object} dataset Object containing the data for this bindpoint
     * @type type
     */
    set dataset(dataset) {
        let attrName = this.getAttribute('attrName');

        // Make dataset watchable if not allready so
        if (!dataset.notify) {
            SWAC_debug.addDebugMessage('BindPoint', 'create new WatchableSet for ' + dataset.id);
            // Make set and its attributes watchable
            dataset = new WatchableSet(dataset);
        }
        dataset.addObserver(this, attrName);

        this.set = dataset;
        if (typeof dataset[attrName] !== 'undefined') {
            this.value = dataset[attrName];
        } else {
            SWAC_debug.addDebugMessage('BindPoint', 'There is no data for attribute >' + attrName + '< of set >' + dataset.id + '<');
            this.value = undefined;
        }
    }

    get dataset() {
        return this.set;
    }
}
// Register bindpoint element
customElements.define('swac-bp', BindPoint);