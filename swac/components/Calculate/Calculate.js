var CalculateFactory = {};
CalculateFactory.create = function (config) {
    return new Calculate(config);
};

/**
 * Component for calculating with datasets
 */
class Calculate extends Component {

    /*
     * Constructs a new component object and transfers the config to the
     * object
     */
    constructor(options = {}) {
        super(options);
        this.componentName = 'Calculate';

        this.desc.text = 'This component allows calculations with values from datasets.';
        this.desc.templates[0] = {
            name: 'calculate',
            desc: 'Default calculate template.'
        };
        this.desc.optPerTpl[0] = {
            selc: '.swac_repeatForAttribute',
            desc: 'Area which is replaced for every attribute in dataset. This will also be repeated for calculated attributes. Can contain the {attrName} placeholder.'
        };
        this.desc.optPerTpl[1] = {
            selc: '.swac_calculate_saveasjson',
            desc: 'If present allows the export of the calculated data into a json file.'
        };
        this.desc.reqPerSet[0] = {
            name: 'id',
            desc: 'The attribute id is required for the component to work properly.'
        };
        // opts ids over 1000 are reserved for Component independend options
        this.desc.opts[0] = {
            name: "calculations",
            desc: "Definitions of calculations. These are objects with the attributes: formular (formular with names of the dataset attributes) and target (name of the attribute where the result will be stored)"
        };
        // Setting a default value, only applying when the options parameter does not contain this option
        if (!options.calculations)
            this.options.calculations = [];

        // function ids over 1000 are reserved for Component independend functions
        this.desc.funcs[0] = {
            name: 'name of the function',
            desc: 'Functions description',
            params: [
                {
                    name: 'name of the parameter',
                    desc: 'Description of the parameter'
                }
            ]
        };

        // Internal attributes
        this.calculatedSets = [];
    }

    /*
     * This method will be called when the component is complete loaded
     * At this thime the template code is loaded, the data inserted into the 
     * template and even plugins are ready to use.
     */
    init() {
        return new Promise((resolve, reject) => {
            // Calculate for each data
            for (let curSource in this.data) {
                for (let curSet of this.data[curSource]) {
                    if (curSet)
                        this.afterAddSet(curSource, curSet);
                }
            }

            // Register event handler
            let exportJsonBtn = this.requestor.querySelector('.swac_calculate_saveasjson');
            if (exportJsonBtn)
                exportJsonBtn.addEventListener('click', this.onExportAsJson.bind(this));

            resolve();
        });
    }

    /**
     * Method thats called before adding a dataset
     * This overrides the method from Component.js
     * 
     * @param {String} fromName Name of the resource, where the set comes from
     * @param {Object} set Object with attributes to add
     * @returns {Object} (modified) set
     */
    afterAddSet(fromName, set) {
        // Get calculations
        for (let curCalc of this.options.calculations) {
            let formular = curCalc.formular;
            // Walk trough sets attributes
            for (let curAttr in set) {
                formular = formular.replace(curAttr, set[curAttr]);
            }
            let result = eval(formular);
            // Copy set to calculated data
            let setCopy = Object.assign({}, set);
            setCopy[curCalc.target] = result;
            delete setCopy['swac_fromName'];
            delete setCopy['swac_setNo'];
            this.calculatedSets.push(setCopy);
            // Create th if not exists
            let thCalc = this.requestor.querySelector('.swac_calculate_th_' + curCalc.target);
            if (!thCalc) {
                let thCalcTpl = this.requestor.querySelector('.swac_repeatForAttribute');
                thCalc = thCalcTpl.cloneNode(true);
                thCalc.classList.remove('swac_repeatForAttribute');
                thCalc.classList.add('swac_repetedForAttribute');
                thCalc.classList.add('swac_calculate_th_' + curCalc.target);
                thCalc.innerHTML = 'f() = ' + curCalc.target;
                thCalc.setAttribute('uk-tooltip', curCalc.formular);
                thCalcTpl.parentNode.appendChild(thCalc);
            }

            // Get the row that contains the set calculated for
            let calcRow = this.requestor.querySelector('.swac_repeatedForSet[swac_setId="' + set.id + '"]');
            if (!calcRow) {
                SWAC_debug.addErrorMessage('Calculate', 'There is no display for data of set >' + set.id + '<', this.requestor);
            }

            // Create repeat for value
            let valueCalcTpl = this.requestor.querySelector('.swac_repeatForValue');
            let valueCalc = valueCalcTpl.cloneNode(true);
            valueCalc.classList.remove('swac_repeatForValue');
            valueCalc.classList.add('swac_repeatedForValue');
            valueCalc.innerHTML = valueCalc.innerHTML.replace('{*}', result);
            valueCalc.innerHTML = valueCalc.innerHTML.replace('{attrName}', curCalc.target);
            calcRow.appendChild(valueCalc);
        }


        return set;
    }

    /**
     * Exports the curent state of the calculated data as json file
     * 
     * @param {type} evt
     * @returns {undefined}
     */
    onExportAsJson(evt) {
        let data = JSON.stringify(this.calculatedSets);
        let dataURL = 'data:application/json,' + data;
        var link = document.createElement('a');
        link.download = 'calculation_result.json';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


