var TexteditorFactory = {};
TexteditorFactory.create = function (config) {
    return new Texteditor(config);
};

/**
 * Advanced editor for texts
 */
class Texteditor extends Component {

    constructor(options = {}) {
        super(options);
        this.componentName = 'Texteditor';

        this.desc.text = 'Component for advanced texteditor functionality. \n\
Can be used as texteditor with formating and lots of other enhanced functions.';
        this.desc.premium = true;
        this.desc.depends[0] = {
            name: 'tinymce.min.js',
            path: SWAC_config.swac_root + '/swac/components/Texteditor/libs/tinymce/tinymce.min.js',
            desc: 'TinyMCE editor library'
        };
        this.desc.templates[0] = {
            name: 'texteditor',
            style: 'texteditor',
            desc: 'Shows a texteditor field with enhanced features.'
        };
        this.desc.reqPerTpl[0] = {
            selc: '.swac_texteditor',
            desc: 'Marking class for all elements that should be replaced by an editor.'
        };
        this.desc.reqPerSet[0] = {
            name: 'id',
            desc: 'The attribute id is required for the component to work properly.'
        };
        this.desc.reqPerSet[1] = {
            name: 'title',
            desc: 'Title of the document.'
        };
        this.desc.reqPerSet[2] = {
            name: 'content',
            desc: 'Documents content.'
        };
        if (!options.showWhenNoData)
            this.options.showWhenNoData = true;
        this.desc.opts[1] = {
            name: "tinymcePlugins",
            desc: "Space or coma seperated list or array of strings with plugin names that should be activated."
        };
        if (!options.tinymcePlugins)
            this.options.tinymcePlugins = null;
        this.desc.opts[2] = {
            name: "tinymceToolbar",
            desc: "Use a space-separated list to specify the buttons that appear in TinyMCE’s toolbar. Use " | " pipe characters between the groups of buttons to create groups within this list."
        };
        if (!options.tinymceToolbar)
            this.options.tinymceToolbar = true;
        this.desc.opts[3] = {
            name: "tinymceMenubar",
            desc: "Definition of the editors menuebar. See tinyMCE documentation for more information."
        };
        if (!options.tinymceMenubar)
            this.options.tinymceMenubar = true;
        this.desc.opts[4] = {
            name: "tinymceMenu",
            desc: "Definition of the editors menue. See tinyMCE documentation for more information."
        };
        if (!options.tinymceMenu)
            this.options.tinymceMenu = true;
        this.desc.opts[5] = {
            name: "tinymceContent_css",
            desc: "Path to a css file containing the style for the editors content."
        };
        if (!options.tinymceContent_css)
            this.options.tinymceContent_css = null;
        this.desc.opts[6] = {
            name: 'sendAlongData',
            desc: 'DataCapsle with data that should be send with every save. This is an object of form {attr1: val1, ...}.'
        };
        if (!options.sendAlongData)
            this.options.sendAlongData = null;

        this.plugins.set('languagecheck', {
            active: true
        });
        this.plugins.set('groupwrite', {
            active: false
        });
        this.plugins.set('infoconnect', {
            active: false
        });
    }

    init() {
        return new Promise((resolve, reject) => {
            // Add swac tinymce menue
            let menuebar = 'swac_tinymenue edit';
            if (typeof this.options.tinymceMenubar === 'string') {
                menuebar = 'swactinymce ' + this.options.tinymceMenubar;
            }

            // Copy content from content_ref to textarea
            let repeateds = this.requestor.querySelectorAll('.swac_repeatedForSet');
            for (let curRepeated of repeateds) {
                let cont_ref = curRepeated.querySelector('.swac_texteditor_contentref');
                if (cont_ref) {
                    let textarea = curRepeated.querySelector('.swac_texteditor_area');
                    textarea.innerHTML = cont_ref.innerHTML;
                }
            }

            let thisRef = this;
            // Init tinymce editor
            tinymce.init({
                selector: '.swac_texteditor_area',
                height: window.innerHeight - 5,
                plugins: this.options.tinymcePlugins,
                toolbar: this.options.tinymceToolbar,
                content_css: this.options.tinymceContent_css,
                menu: {
                    swac_tinymenue: {title: SWAC_language.Texteditor.filemenu, items: 'swac_save'}
                },
                menubar: menuebar,
                setup: (editor) => {
                    editor.ui.registry.addMenuItem('swac_save', {
                        text: SWAC_language.core.save,
                        onAction: thisRef.save.bind(thisRef)
                    });
                }
            }).then(function (tinyLoadResult) {
                resolve();
            }).catch(function (error) {
                reject('Could not load texteditor: ' + error);
            });

            // Move new-tab and new-doc to the end
            let newtabElem = this.requestor.querySelector('.swac_texteditor_newtab');
            newtabElem.parentElement.appendChild(newtabElem);
            let newdocElem = this.requestor.querySelector('.swac_texteditor_newdoc');
            newdocElem.parentElement.appendChild(newdocElem);

            // Open first tab (timeout is workaround for rehide bug)
            let switcherElem = this.requestor.querySelector('.uk-switcher');
            setTimeout(function () {
                UIkit.switcher(switcherElem).show(1);
            }, 200);

            resolve();
        });
    }

    /**
     * Save the textcontent
     * 
     * @param {type} evt
     * @returns {undefined}
     */
    save(evt) {
        SWAC_debug.addDebugMessage('Texteditor', 'Saveing document.', this.requestor);

        let dataCapsle = {};
        dataCapsle.data = [];
        if (this.options.sendAlongData !== null) {
            dataCapsle.data[0] = Object.assign({}, this.options.sendAlongData);
        } else {
            dataCapsle.data[0] = {};
        }
        dataCapsle.metadata = {};
        // Set target for data saveing
        dataCapsle.metadata.fromSource = this.requestor.fromName;

        let activeEditor = tinymce.activeEditor;
        let setElem = this.requestor.swac_view.findReapeatedForSet(activeEditor.editorContainer);
        // If there is no setelem this is a new document
        if (setElem) {
            dataCapsle.data[0].id = setElem.getAttribute('swac_setid');
        }
        // Get the textcontent
        let content = activeEditor.getContent();
        dataCapsle.data[0].content = content;

        // Save data with model
        let thisRef = this;
        let savePromise = SWAC_model.save(dataCapsle);
        savePromise.then(function (results) {
            // Add dataset to component if it is new
            if (!formElem.getAttribute('swac_id')) {
                for (let curResult of results) {
                    thisRef.addSet(dataCapsle.metadata.fromSource, curResult);
                }
            } else {
                //Update dataset stored
                for (let curResult of results) {
                    thisRef.updateSet(dataCapsle.metadata.fromSource, curResult);
                }
            }
        });
    }
}