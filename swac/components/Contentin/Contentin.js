var ContentinFactory = {};
ContentinFactory.create = function (config) {
    return new Contentin(config);
};

class Contentin extends Component {

    /*
     * Constructs a new component object and transfers the config to the
     * object
     */
    constructor(options = {}) {
        super(options);
        this.componentName = 'Contentin';
        this.desc.premium = true;

        this.desc.text = 'Component for integrating content from third party sites into the own site. This component needs the server side SBAC components due to browsers CORS restirctions.';
        this.desc.templates[0] = {
            name: 'contentin',
            style: false,
            desc: 'Default template.'
        };

        this.desc.optPerTpl[0] = {
            selc: '.swac_contentin_export_json',
            desc: 'When clicked the user becomes the shown data as json file download.'
        };

        if (!options.showWhenNoData)
            this.options.showWhenNoData = true;

        this.desc.opts[0] = {
            name: "sourcedefs",
            desc: "Definition of sources where to extract datasets from and how."
        };
        if (!options.sourcedefs)
            this.options.sourcedefs = [];

    }

    /*
     * This method will be called when the component is complete loaded
     * At this thime the template code is loaded, the data inserted into the 
     * template and even plugins are ready to use.
     */
    init() {
        return new Promise((resolve, reject) => {
            let thisRef = this;
            for (let curSourcedef of this.options.sourcedefs) {
                const options = {
                    method: 'POST',
                    body: JSON.stringify(curSourcedef),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                
                // Fetch data from source useing backend
                fetch(SWAC_config.sbac_root + '/data/scrape.php', options).then(
                        function (data) {
                            return data.json();
                        }
                ).then(
                        function (json) {
                            for(let set of json.list) {
                                thisRef.addSet(set.url,set);
                            }
                        }
                ).catch(
                        function (error) {
                            SWAC_debug.addErrorMessage('Contentin', 'Error while fetching data: ' + error, thisRef.requestor);
                        }
                );
            }

            // Register export function
            let exportElems = this.requestor.querySelectorAll('.swac_contentin_export_json');
            for(let curExportElem of exportElems) {
                curExportElem.addEventListener('click',this.exportJson.bind(this));
            }

            resolve();
        });
    }
}


