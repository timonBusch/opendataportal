var ForwardingFactory = {};
ForwardingFactory.create = function (config) {
    return new Forwarding(config);
};
/**
 * Component for creating forwarding from data
 */
class Forwarding extends Component {

    /*
     * Constructs a new component object and transfers the config to the
     * object
     */
    constructor(options) {
        super(options);
        this.componentName = 'Forwarding';

        this.desc.text = 'The forwarding component allows automatic forwarding to another page depending on data.';

        this.desc.reqPerSet[0] = {
            name: 'displayDuration',
            desc: 'Duration in second until the forwarding should occur'
        };
        this.desc.reqPerSet[1] = {
            name: 'hyperlink',
            desc: 'Target of the forwarding'
        };
    }

    init() {
        return new Promise((resolve, reject) => {
            for (let curSource in this.data) {
                for (let curSet of this.data[curSource]) {
                    if (curSet) {
                        if (this.beforeAddDataset(curSource, curSet)) {
                            this.afterAddDataset(curSource, curSet);
                        }
                    }
                }
            }

            resolve();
        });
    }

    beforeAddDataset(fromName, set) {
        if (typeof set.displayDuration !== 'number' && (set.displayDuration > -1)) {
            SWAC_debug.addDebugMessage('Forwarding', 'Given displayDuration >'
                    + set.displayDuration + '< is not a positive seconds duration.',
                    this.requestor);
            return;
        }

        if (set.hyperlink === '') {
            SWAC_debug.addDebugMessage('Forwarding', 'Given url >'
                    + set.hyperlink + '< is not a valid url.',
                    this.requestor);
            reject();
            return;
        }
        return set;
    }

    afterAddDataset(fromName, set) {
        setTimeout(() => {
            window.location.assign(set.hyperlink);
        }, set.displayDuration * 1000);

        SWAC_debug.addDebugMessage('Forwarding', 'Created forwarding to >'
                + set.hyperlink + '< in >'
                + set.displayDuration + ' seconds');

        return;
    }
}