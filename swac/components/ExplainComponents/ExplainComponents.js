var ExplainComponentsFactory = {};
ExplainComponentsFactory.create = function (config) {
    return new ExplainComponents(config);
};

/* 
 * Class for generating explanation of components
 */

class ExplainComponents extends Component {
    constructor(options) {
        super(options);
        this.componentName = 'ExplainComponents';
        this.desc.text = 'Generates explanations of SWAC components.';

        this.desc.depends[0] = {
            name: 'he.js',
            path: SWAC_config.swac_root + '/swac/libs/he.js',
            desc: 'he.js library for code highlighting.'
        };
        this.desc.depends[1] = {
            name: 'he.js pack',
            path: SWAC_config.swac_root + '/swac/libs/highlight/highlight.pack.js',
            desc: 'Extension for languages used with he.js'
        };

        this.desc.templates[0] = {
            name: 'accordion',
            style: false,
            desc: 'Shows the explanations in an accordion.'
        };

        this.options.showWhenNoData = true;

        this.desc.opts[0] = {
            name: 'componentName',
            desc: 'Name of the component that should be explained.'
        };
        if (!this.options.componentName)
            this.options.componentName = null;
    }

    init() {
        return new Promise((resolve, reject) => {

            let componentName = this.options.componentName;
            if (!componentName) {
                let msgElem = document.createTextNode(SWAC_language.ExplainComponents.noComponentSelected);
                this.requestor.appendChild(msgElem);
                resolve();
                return;
            }

            let component_url = SWAC_config.swac_root + '/swac/components/'
                    + componentName + '/' + componentName + '.js';

            // Check if component is loaded
            if (!window[componentName] + 'Factory') {
                let thisObj = this;
                // Load script file
                let dependencyStack = [];
                dependencyStack.push({path: component_url});
                SWAC.loadDependenciesStack(dependencyStack, this).then(function () {
                    try {
                        let explObj = window[componentName + 'Factory'].create();
                        let allDiv = thisObj.explainAll(explObj);
                        thisObj.requestor.appendChild(allDiv);
                        resolve();
                    } catch (error) {
                        SWAC_debug.addErrorMessage('ExplainComponents',
                                'Error while explaining the component >'
                                + componentName + '<: ' + error, thisObj.requestor);
                    }
                }).catch(function (error) {
                    SWAC_debug.addErrorMessage('ExplainComponents',
                            'Could not load code for >' + componentName + '<: ' + error);
                });
            } else {
                let explObj = window[componentName + 'Factory'].create();
                let allDiv = thisObj.explainAll(explObj);
                this.requestor.appendChild(allDiv);
                resolve();
            }
        });
    }

    /**
     * Creates a explanation in html about all areas.
     * 
     * @param {SWACComponent} component Component to explain
     * @returns {HTMLElement}
     */
    explainAll(component) {
        let explainArticle = document.createElement('article');
        explainArticle.classList.add('uk-article');
        let explainHeadline = document.createElement('h1');
        explainHeadline.classList.add("uk-article-title");
        explainHeadline.appendChild(document.createTextNode(component.componentName));
        explainArticle.appendChild(explainHeadline);
        if (component.desc.premium) {
            let premiumBadge = document.createElement('span');
            premiumBadge.innerHTML = 'Premium';
            premiumBadge.classList.add('uk-badge');
            explainHeadline.appendChild(premiumBadge);
        }
        let explainHeadtext = document.createElement('p');
        explainHeadtext.classList.add("uk-article-meta");
        explainHeadtext.appendChild(document.createTextNode(component.desc.text));
        explainArticle.appendChild(explainHeadtext);

        let explainAccordion = document.createElement('ul');
        explainAccordion.setAttribute('uk-accordion', 'uk-accordion');
        let dataReqLi = document.createElement('li');
        let dataReqTitle = document.createElement('a');
        dataReqTitle.classList.add('uk-accordion-title');
        dataReqTitle.setAttribute('href', '#');
        dataReqTitle.innerHTML = SWAC_language.ExplainComponents.datasets;
        dataReqLi.appendChild(dataReqTitle);
        let dataReqDiv = this.explainDataRequirements(component);
        dataReqDiv.classList.add('uk-accordion-content');
        dataReqLi.appendChild(dataReqDiv);
        explainAccordion.appendChild(dataReqLi);

        let optionsLi = document.createElement('li');
        let optionsTitle = document.createElement('a');
        optionsTitle.classList.add('uk-accordion-title');
        optionsTitle.setAttribute('href', '#');
        optionsTitle.innerHTML = SWAC_language.ExplainComponents.options;
        optionsLi.appendChild(optionsTitle);
        let optionsDiv = this.explainOptions(component);
        optionsDiv.classList.add('uk-accordion-content');
        optionsLi.appendChild(optionsDiv);
        explainAccordion.appendChild(optionsLi);

        let templateReqLi = document.createElement('li');
        let templateReqTitle = document.createElement('a');
        templateReqTitle.classList.add('uk-accordion-title');
        templateReqTitle.setAttribute('href', '#');
        templateReqTitle.innerHTML = SWAC_language.ExplainComponents.template;
        templateReqLi.appendChild(templateReqTitle);
        let tmplReqDiv = this.explainTplRequirements(component);
        tmplReqDiv.classList.add('uk-accordion-content');
        templateReqLi.appendChild(tmplReqDiv);
        explainAccordion.appendChild(templateReqLi);

        let templatesLi = document.createElement('li');
        let templatesTitle = document.createElement('a');
        templatesTitle.classList.add('uk-accordion-title');
        templatesTitle.setAttribute('href', '#');
        templatesTitle.innerHTML = SWAC_language.ExplainComponents.templates;
        templatesLi.appendChild(templatesTitle);
        let tmplsDiv = this.explainAllTemplates(component);
        tmplsDiv.classList.add('uk-accordion-content');
        templatesLi.appendChild(tmplsDiv);
        explainAccordion.appendChild(templatesLi);

        let stylesLi = document.createElement('li');
        let stylesTitle = document.createElement('a');
        stylesTitle.classList.add('uk-accordion-title');
        stylesTitle.setAttribute('href', '#');
        stylesTitle.innerHTML = SWAC_language.ExplainComponents.styles;
        stylesLi.appendChild(stylesTitle);
        let stylesDiv = this.explainStyles(component);
        stylesDiv.classList.add('uk-accordion-content');
        stylesLi.appendChild(stylesDiv);
        explainAccordion.appendChild(stylesLi);

        let functionsLi = document.createElement('li');
        let functionsTitle = document.createElement('a');
        functionsTitle.classList.add('uk-accordion-title');
        functionsTitle.setAttribute('href', '#');
        functionsTitle.innerHTML = SWAC_language.ExplainComponents.functions;
        functionsLi.appendChild(functionsTitle);
        let functionsDiv = this.explainFunctions(component);
        functionsDiv.classList.add('uk-accordion-content');
        functionsLi.appendChild(functionsDiv);
        explainAccordion.appendChild(functionsLi);

        let dependenciesLi = document.createElement('li');
        let dependenciesTitle = document.createElement('a');
        dependenciesTitle.classList.add('uk-accordion-title');
        dependenciesTitle.setAttribute('href', '#');
        dependenciesTitle.innerHTML = SWAC_language.ExplainComponents.dependencies;
        dependenciesLi.appendChild(dependenciesTitle);
        let dependenciesDiv = this.explainDependencies(component);
        dependenciesDiv.classList.add('uk-accordion-content');
        dependenciesLi.appendChild(dependenciesDiv);
        explainAccordion.appendChild(dependenciesLi);

        explainArticle.appendChild(explainAccordion);

        return explainArticle;
    }

    /**
     * Creates a explanation in html about the data requirements.
     * 
     * @param {SWACComponent} component Component to explain
     * @returns {Element|this.explainDataRequirements.reqDiv}
     */
    explainDataRequirements(component) {
        let reqDiv = document.createElement('div');
        let reqDivHead = document.createElement('h3');
        reqDivHead.innerHTML = SWAC_language.ExplainComponents.datasets;
        reqDiv.appendChild(reqDivHead);

        // Create table
        let table = document.createElement('table');
        table.setAttribute('class', 'uk-table');
        let th = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = SWAC_language.ExplainComponents.attributeName;
        th.appendChild(th1);
        let th2 = document.createElement('th');
        th2.innerHTML = SWAC_language.ExplainComponents.attributeDesc;
        th.appendChild(th2);
        let th3 = document.createElement('th');
        th3.innerHTML = SWAC_language.ExplainComponents.attributeReq;
        th.appendChild(th3);
        table.appendChild(th);

        if (typeof component.desc === 'undefined') {
            let tr = document.createElement("tr");
            let td = document.creeateElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.noDescription;
            tr.appendChild(td);
            table.appendChild(tr);
            reqDiv.appendChild(table);
            return reqDiv;
        }

        if (typeof component.desc.reqPerSet === 'undefined' || component.desc.reqPerSet.length === 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.attributesNone;
            tr.appendChild(td);
            table.appendChild(tr);
        }

        if (component.desc.reqPerSet) {
            // Create tablerow for each required attribute
            for (let curReq of component.desc.reqPerSet) {
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.innerHTML = curReq.name;
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = curReq.desc;
                tr.appendChild(td2);
                let td3 = document.createElement("td");
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('checked', 'checked');
                checkbox.setAttribute('disabled', 'disabled');
                checkbox.classList.add('uk-checkbox');
                td3.appendChild(checkbox);
                tr.appendChild(td3);
                table.appendChild(tr);
            }
        }

        if (component.desc.optPerSet) {
            // Create tablerow for each optional attribute
            for (let curOpt of component.desc.optPerSet) {
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.innerHTML = curOpt.name;
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = curOpt.desc;
                tr.appendChild(td2);
                let td3 = document.createElement("td");
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('disabled', 'disabled');
                checkbox.classList.add('uk-checkbox');
                td3.appendChild(checkbox);
                tr.appendChild(td3);
                table.appendChild(tr);
            }
        }
        reqDiv.appendChild(table);
        return reqDiv;
    }

    /**
     * Creates a explanation about dependencies of this component.
     * 
     * @param {SWACComponent} component Component to explain
     * @returns {Element|this.explainDependencies.depDiv}
     */
    explainDependencies(component) {
        let depDiv = document.createElement('div');
        let depDivHead = document.createElement('h3');
        depDivHead.innerHTML = SWAC_language.ExplainComponents.dependencies;
        depDiv.appendChild(depDivHead);

        // Create table
        let table = document.createElement('table');
        table.setAttribute('class', 'uk-table');
        let th = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = SWAC_language.ExplainComponents.dependenciesName;
        th.appendChild(th1);
        let th2 = document.createElement('th');
        th2.innerHTML = SWAC_language.ExplainComponents.dependenciesDesc;
        th.appendChild(th2);
        let th3 = document.createElement('th');
        th3.innerHTML = SWAC_language.ExplainComponents.dependenciesPath;
        th.appendChild(th3);
        table.appendChild(th);

        if (typeof component.desc === 'undefined') {
            let tr = document.createElement("tr");
            let td = document.creeateElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.noDescription;
            tr.appendChild(td);
            table.appendChild(tr);
            depDiv.appendChild(table);
            return depDiv;
        }

        if (typeof component.desc.depends === 'undefined' || component.desc.depends.length === 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.dependenciesNone;
            tr.appendChild(td);
            table.appendChild(tr);
        }

        if (typeof component.desc.depends !== 'undefined') {
            // Create tablerow for each required attribute
            for (let curDependency of component.desc.depends) {
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.innerHTML = curDependency.name;
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = curDependency.desc;
                tr.appendChild(td2);
                let td3 = document.createElement("td");
                td3.innerHTML = curDependency.path;
                tr.appendChild(td3);
                table.appendChild(tr);
            }
        }

        depDiv.appendChild(table);
        return depDiv;
    }

    /**
     * Explains the requirements on the template.
     * 
     * @param {SWACComponent} component Component to explain
     * @returns {Element|this.explainTplRequirements.reqDiv}
     */
    explainTplRequirements(component) {
        let reqDiv = document.createElement('div');
        let reqDivHead = document.createElement('h3');
        reqDivHead.innerHTML = SWAC_language.ExplainComponents.template;
        reqDiv.appendChild(reqDivHead);

        // Create table
        let table = document.createElement('table');
        table.setAttribute('class', 'uk-table');
        let th = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = SWAC_language.ExplainComponents.tmplelemSelector;
        th.appendChild(th1);
        let th2 = document.createElement('th');
        th2.innerHTML = SWAC_language.ExplainComponents.tmplelemDesc;
        th.appendChild(th2);
        let th3 = document.createElement('th');
        th3.innerHTML = SWAC_language.ExplainComponents.tmplelemReq;
        th.appendChild(th3);
        table.appendChild(th);

        if (typeof component.desc === 'undefined') {
            let tr = document.createElement("tr");
            let td = document.creeateElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.noDescription;
            tr.appendChild(td);
            table.appendChild(tr);
            reqDiv.appendChild(table);
            return reqDiv;
        }

        if (typeof component.desc.reqPerTpl === 'undefined' || component.desc.reqPerTpl.length === 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.tmplelemsNone;
            tr.appendChild(td);
            table.appendChild(tr);
        }

        if (typeof component.desc.reqPerTpl !== 'undefined') {
            // Create tablerow for each required attribute
            for (let curReq of component.desc.reqPerTpl) {
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.innerHTML = curReq.selc;
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = curReq.desc;
                tr.appendChild(td2);
                let td3 = document.createElement("td");
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('checked', 'checked');
                checkbox.setAttribute('disabled', 'disabled');
                checkbox.classList.add('uk-checkbox');
                td3.appendChild(checkbox);
                tr.appendChild(td3);
                table.appendChild(tr);
            }
        }

        if (typeof component.desc.optPerTpl !== 'undefined') {
            // Create tablerow for each optional attribute
            for (let curOpt of component.desc.optPerTpl) {
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.innerHTML = curOpt.selc;
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = curOpt.desc;
                tr.appendChild(td2);
                let td3 = document.createElement("td");
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('disabled', 'disabled');
                checkbox.classList.add('uk-checkbox');
                td3.appendChild(checkbox);
                tr.appendChild(td3);
                table.appendChild(tr);
            }
        }
        reqDiv.appendChild(table);

        return reqDiv;
    }

    /**
     * Explains all available templates for the given component
     * 
     * @param {SWACComponent} component SWAC component to explain fragment with
     * @returns {undefined}
     */
    explainAllTemplates(component) {
        let explDiv = document.createElement('div');

        // Get available templates
        let templates = [];
        if (typeof component.desc !== 'undefined'
                && typeof component.desc.templates !== 'undefined') {
            templates = component.desc.templates;
        } else {
            templates[0] = {
                name: component.componentName,
                desc: 'Default template for ' + component.componentName
            };
        }

        let notemplates = 0;
        for (let curTemplate of templates) {
            notemplates++;
            let explDivHead = document.createElement('h3');
            explDivHead.innerHTML = 'Template "' + curTemplate.name + '"';
            explDiv.appendChild(explDivHead);
            let explDivP = document.createElement('p');
            explDivP.innerHTML = curTemplate.desc;
            explDiv.appendChild(explDivP);
            let explDivTmpl = document.createElement('div');
            explDiv.appendChild(explDivTmpl);

            let htmlfragment_url = SWAC_config.swac_root + '/swac/components/' + component.componentName + '/' + curTemplate.name + '.html';
            let thisObj = this;
            // Get component sourcecode
            fetch(htmlfragment_url, {
                // Data in url params not here
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *omit
                headers: {
                    'user-agent': 'SWAC/1.0 fetch',
                    'content-type': 'application/json'
                },
                method: 'GET', // *GET, DELETE
                mode: 'cors', // no-cors, *same-origin
                redirect: 'follow', // *manual, error
                referrer: 'no-referrer' // *client
            }).then(function (response) {
                response.text().then(function (htmlfragment) {
                    thisObj.explainHTMLFragment(htmlfragment, component, explDivTmpl);
                });
            });
        }

        if (notemplates === 0) {
            explDiv.appendChild(document.createTextNode(SWAC_language.ExplainComponents.tplsNone));
        }

        return explDiv;
    }

    /**
     * Creates a description of the options available in the component.
     * 
     * @param {SWAC component} component
     * @returns {undefined}
     */
    explainOptions(component) {
        let explDiv = document.createElement('div');

        let reqDivHead = document.createElement('h3');
        reqDivHead.innerHTML = SWAC_language.ExplainComponents.options;
        explDiv.appendChild(reqDivHead);

        // Create table
        let table = document.createElement('table');
        table.setAttribute('class', 'uk-table');
        let th = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = SWAC_language.ExplainComponents.optionsName;
        th.appendChild(th1);
        let th2 = document.createElement('th');
        th2.innerHTML = SWAC_language.ExplainComponents.optionsDesc;
        th.appendChild(th2);
        let th3 = document.createElement('th');
        th3.innerHTML = SWAC_language.ExplainComponents.optionsDefault;
        th.appendChild(th3);
        table.appendChild(th);

        if (typeof component.options === 'undefined') {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.setAttribute('colspan', '3');
            td.innerHTML = SWAC_language.ExplainComponents.optionsNone;
            tr.appendChild(td);
            table.appendChild(tr);
        }
        // Build up description map
        let descmap = new Map();
        if (component.desc && component.desc.opts) {
            for (let curOptDesc of component.desc.opts) {
                if (!curOptDesc)
                    continue;
                descmap.set(curOptDesc.name, curOptDesc.desc);
            }
        }
        // Add global options
        for (var [key, value] of this.getGlobalOptions().entries()) {
            descmap.set(key, value);
        }

        // Create description table
        for (let curOption in component.options) {
            let tr = document.createElement('tr');
            // Add name
            let tdname = document.createElement('td');
            tdname.innerHTML = curOption;
            tr.appendChild(tdname);
            // Add description
            let tddesc = document.createElement('td');
            let desc = descmap.get(curOption);
            if (typeof desc !== 'undefined') {
                tddesc.innerHTML = desc;
            } else {
                tddesc.innerHTML = SWAC_language.ExplainComponents.optionsNodesc;
            }
            tr.appendChild(tddesc);

            // Add default value
            let tddefault = document.createElement('td');
            tddefault.innerHTML = component.options[curOption];
            tr.appendChild(tddefault);
            table.appendChild(tr);
        }

        explDiv.appendChild(table);

        return explDiv;
    }
    ;
            /**
             * Returns a map with all options that are globally available
             * 
             * @returns {Map|this.getGlobalOptions.globalOptions}
             */
            getGlobalOptions() {
        let globalOptions = new Map();
        globalOptions.set('showWhenNoData', SWAC_language.core.showWhenNoData);
        return globalOptions;
    }

    /**
     * Creates a description of the functions that the component has.
     * 
     * @param {SWACcomponent} component component to describe
     * @returns {HTMLElement} HTML Element with the description
     */
    explainFunctions(component) {
        let explDiv = document.createElement('div');

        if (typeof component.desc.funcs === 'undefined' || component.desc.funcs.length === 0) {
            explDiv.appendChild(document.createTextNode(SWAC_language.ExplainComponents.noFunctions));
            return explDiv;
        }

        for (let curFunc of component.desc.funcs) {
            // Exclude holes in array
            if (!curFunc)
                continue;
            let funcArea = document.createElement('div');
            let funcExplHead = document.createElement('h3');
            funcExplHead.appendChild(document.createTextNode(curFunc.name));
            funcArea.appendChild(funcExplHead);
            let funcExplText = document.createTextNode(curFunc.desc);
            funcArea.appendChild(funcExplText);
            // Table for params
            let paramTable = document.createElement('table');
            paramTable.classList.add('uk-table');
            let paramTableHead = document.createElement('tr');
            let paramNameCaption = document.createElement('th');
            paramNameCaption.appendChild(document.createTextNode(SWAC_language.ExplainComponents.paramName));
            paramTableHead.appendChild(paramNameCaption);
            let paramDescCaption = document.createElement('th');
            paramDescCaption.appendChild(document.createTextNode(SWAC_language.ExplainComponents.paramDescription));
            paramTableHead.appendChild(paramDescCaption);
            paramTable.appendChild(paramTableHead);

            if (curFunc.params && curFunc.params.length > 0) {
                // List params
                for (let param of curFunc.params) {
                    let paramTableRow = document.createElement('tr');
                    let paramName = document.createElement('td');
                    paramName.appendChild(document.createTextNode(param.name));
                    paramTableRow.appendChild(paramName);
                    let paramDesc = document.createElement('td');
                    paramDesc.appendChild(document.createTextNode(param.desc));
                    paramTableRow.appendChild(paramDesc);
                    paramTable.appendChild(paramTableRow);
                }
            } else {
                // Message about no params
                let paramTableRow = document.createElement('tr');
                let paramMsg = document.createElement('td');
                paramMsg.setAttribute('rowspan', '2');
                paramMsg.appendChild(document.createTextNode(SWAC_language.ExplainComponents.noParams));
                paramTableRow.appendChild(paramMsg);
                paramTable.appendChild(paramTableRow);
            }
            funcArea.appendChild(paramTable);

            explDiv.appendChild(funcArea);
        }

        return explDiv;
    }

    /**
     * Creates a description of the given HTMlfragment acordingly
     * 
     * @param {String} htmlfragment HTMLfragment to explain
     * @param {SWACComponent} component SWAC component to explain fragment with
     * @param {DOMElement} reqDiv DOM element where to add the explanation
     * @returns {undefined}
     */
    explainHTMLFragment(htmlfragment, component, reqDiv) {
        this.encodeHTML(htmlfragment).then(function (codeElem) {
            let preElem = document.createElement('pre');
            preElem.appendChild(codeElem);
            reqDiv.appendChild(preElem);

            //TODO insert highlights with popup that descripes the highlighted element
        });
    }

    /**
     * Explains the styles this component offers
     * 
     * @param {SWACComponent} component Component to explain
     * @returns {Element|this.explainTplRequirements.reqDiv}
     */
    explainStyles(component) {
        let stylesDiv = document.createElement('div');
        let stylesDivHead = document.createElement('h3');
        stylesDivHead.innerHTML = SWAC_language.ExplainComponents.styles;
        stylesDiv.appendChild(stylesDivHead);

        // Create table
        let table = document.createElement('table');
        table.setAttribute('class', 'uk-table');
        let th = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.innerHTML = SWAC_language.ExplainComponents.styleSelector;
        th.appendChild(th1);
        let th2 = document.createElement('th');
        th2.innerHTML = SWAC_language.ExplainComponents.styleDesc;
        th.appendChild(th2);
        table.appendChild(th);

        if (!component.desc) {
            let tr = document.createElement("tr");
            let td = document.creeateElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.noDescription;
            tr.appendChild(td);
            table.appendChild(tr);
            stylesDiv.appendChild(table);
            return stylesDiv;
        }

        if (!component.desc.styles || component.desc.styles.length === 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.setAttribute('colspan', '2');
            td.innerHTML = SWAC_language.ExplainComponents.stylesNone;
            tr.appendChild(td);
            table.appendChild(tr);
        } else {
            // Create tablerow for each optional attribute
            for (let curStyle of component.desc.styles) {
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.innerHTML = curStyle.selc;
                tr.appendChild(td1);
                let td2 = document.createElement("td");
                td2.innerHTML = curStyle.desc;
                tr.appendChild(td2);
                table.appendChild(tr);
            }
        }
        stylesDiv.appendChild(table);

        return stylesDiv;
    }

    /**
     * Encodes a htmlfragment string and highlights it.
     * 
     * @param {String} htmlfragment HTML code fragment
     * @returns {Promise} Promise that resolves to an DOMElement with htmlfragment as text
     */
    encodeHTML(htmlfragment) {
        return new Promise((resolve, reject) => {
            // Load highlight.js style
            let cssLinkElem = document.createElement("link");
            cssLinkElem.setAttribute("href", SWAC_config.swac_root + "/swac/libs/highlight/styles/default.css");
            cssLinkElem.setAttribute("type", "text/css");
            cssLinkElem.setAttribute("rel", "stylesheet");
            document.head.appendChild(cssLinkElem);

            // Highlight code elements allready existing on page
            let codeElems = document.querySelectorAll('pre code');
            for (let codeElem of codeElems) {
                hljs.highlightBlock(codeElem);
            }
            // Insert code from template and highlight
            let encodedhtml = he.encode(htmlfragment);
            let codeElem = document.createElement('code');
            codeElem.innerHTML = encodedhtml;
            hljs.highlightBlock(codeElem);
            resolve(codeElem);
        });
    }
}