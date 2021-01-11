var SampleFactory = {};
SampleFactory.create = function (config) {
    return new Sample(config);
};

/**
 * Sample component for development of own components
 */

class Sample extends Component {

    /*
     * Constructs a new component object and transfers the config to the
     * object
     */
    constructor(options = {}) {
        super(options);
        this.componentName = 'Sample';

        this.desc.text = 'Description of this component for documentation.';
        this.desc.depends[0] = {
            name: 'dependency.js',
            path: SWAC_config.swac_root + '/swac/components/Sample/libs/dependency.js',
            desc: 'Description for what the file is required.'
        };
        this.desc.templates[0] = {
            name: 'templatefilename',
            style: 'stylefilename',
            desc: 'Description of the template.'
        };
        this.desc.styles[0] = {
            selc: 'cssSelectorForTheStyle',
            desc: 'Description of the provided style.'
        };
        this.desc.reqPerTpl[0] = {
            selc: 'cssSelectorForRequiredElement',
            desc: 'Description why the element is expected in the template'
        };
        this.desc.optPerTpl[0] = {
            selc: 'cssSelectorForOptionalElement',
            desc: 'Description what is the expected effect, when this element is in the template.'
        };
        this.desc.optPerPage[0] = {
            selc: 'cssSelectorForOptionalElement',
            desc: 'Description what the component does with the element if its there.'
        };
        this.desc.reqPerSet[0] = {
            name: 'id',
            desc: 'The attribute id is required for the component to work properly.'
        };
        this.desc.optPerSet[0] = {
            name: 'nameOfTheAttributeOptionalInEachSet',
            desc: 'Description what is the expected effect, when this attribute is in the set.'
        };
        // opts ids over 1000 are reserved for Component independend options
        this.desc.opts[0] = {
            name: "OptionsName",
            desc: "This is the description of an option"
        };
        // Setting a default value, only applying when the options parameter does not contain this option
        if (!options.OptionsName)
            this.options.OptionsName = 'defaultvalue';
        // Sample for useing the general option showWhenNoData
        if (!options.showWhenNoData)
            this.options.showWhenNoData = true;
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
    }

    /*
     * This method will be called when the component is complete loaded
     * At this thime the template code is loaded, the data inserted into the 
     * template and even plugins are ready to use.
     */ 
    init() {
        return new Promise((resolve, reject) => {

            // here we can do what we want with the data and template.
            
            // we can access the date over the data attrbute
            console.log('Data inside the sample component:');
            console.log(this.data);
            
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
    beforeAddSet(fromName, set) {
        // You can check or transform the dataset here
        return set;
    }
    
    /**
     * Method thats called after a dataset was added.
     * This overrides the method from Component.js
     * 
     * @param {String} fromName Name of the resource, where the set comes from
     * @param {Object} set Object with attributes to add
     * @returns {undefined}
     */
    afterAddSet(fromName, set) {
        // You can do after adding actions here. At this timepoint the template
        // repeatForSet is also repeated and accessable.
        // e.g. generate a custom view for the data.
        return;
    }
}


