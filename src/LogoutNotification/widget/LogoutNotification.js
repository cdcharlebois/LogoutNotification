import {
    defineWidget,
    log,
    runCallback,
} from 'widget-base-helpers';

export default defineWidget('LogoutNotification', false, {

    _obj: null,
    _logoutTimer: null,
    waitTime: 5000,
    debugging: true,
    notificationTitle: "Title",
    notificationText: "Text",

    constructor() {
        this.log = log.bind(this);
        this.runCallback = runCallback.bind(this);
    },

    postCreate() {
        log.call(this, 'postCreate', this._WIDGET_VERSION);
        const act = () => {
            if (this.debugging) { console.log("Setting listeners"); }
            document.addEventListener("resume", this._stopLogoutTimer.bind(this));
            document.addEventListener("pause", this._startLogoutTimer.bind(this), false);
        };
        const wait = setInterval(() => {
            if ("undefined" !== cordova) {
                act();
                clearInterval(wait);
            }
        }, 100);

    },

    _logoutAndNotify() {
        cordova.plugins.notification.local.schedule({
            title: this.notificationTitle,
            text: this.notificationText,
        });
        window.mx.logout();
    },

    _startLogoutTimer() {
        if (this.debugging) { console.log("Starting timer"); }
        this._logoutTimer = setTimeout(this._logoutAndNotify.bind(this), this.waitTime);
    },

    _stopLogoutTimer() {
        if (this.debugging) { console.log("Stopping timer"); }
        clearInterval(this._logoutTimer);
    },
});