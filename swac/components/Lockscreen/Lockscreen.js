var LockscreenFactory = {};
LockscreenFactory.create = function (config) {
    return new Lockscreen(config);
};

/**
 * Component for createing an lock screen. This greys out the page so that is
 * in view but not useable.
 */
class Lockscreen extends Component {

    constructor(options) {
        super(options);
        this.componentName = 'Lockscreen';
        this.desc.text = 'Creates a lock for the screen.';
        this.desc.templates[0] = {
            name: 'lockscreen',
            style: false,
            desc: 'Contains the overlay modal.'
        };
        this.options.showWhenNoData = true;
        this.desc.opts[0] = {
            name: "unlockable",
            desc: "If set to true the screen can be unlocked by clicking somewhere."
        };
        this.options.unlockable = true;
        this.desc.opts[1] = {
            name: "timeToLook",
            desc: "The time (in miliseconds) after which the page will be locked."
        };
        this.options.timeToLook = 600000;

        // internal values
        this.interval = null;
        this.isLocked = false;
    }

    init() {
        return new Promise((resolve, reject) => {
            // Set interval until lock screen
            this.interval = setInterval(this.lock, this.options.timeToLook);
            resolve();
        });
    }

    /**
     * Executed when intervall ticks
     * 
     * @param {Event} evt Event that requested the lock
     * @returns {undefined}
     */
    onIntervalTick(evt) {
        this.lock();
    }

    /**
     * Locks the screen
     * 
     * @param {Event} evt Event that requested the lock
     * @returns {undefined}
     */
    lock(message, closeable = true) {
        if (typeof message !== 'undefined') {
            // Change message
            document.querySelector('.swac_lockscreenMessage').innerHTML = message;
        }
        // Finaly lock screen
        if (closeable === false || this.options.unlockable === false) {
            UIkit.util.on('#lockscreenModal', 'beforehide', function (evt) {
                // Do not let the user close the modal
                evt.preventDefault();
                clearInterval(this.interval);
                return;
            });
        }
        ;

        let event = new Event('click');
        let element = document.getElementById('lockscreenLockButton');
        if (element !== null && this.isLocked === false) {
            element.dispatchEvent(event);
            this.isLocked = true;

            UIkit.util.on('#lockscreenModal', 'hide', function () {
                this.isLocked = false;
            });
        } else if (this.isLocked === false) {
            SWAC_debug.addDebugMessage('lockscreen', 'The required template element >#lockscreenLockButton< was not found. Lockscreen is now diabled.');
            clearInterval(this.interval);
    }
    }
}