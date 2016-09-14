'use strict';

module.exports = class Dialog {

    /**
     * Dialog Constructor
     * @param props {
     *  id: Unique ID for Dialog
     *  title: Dialog Title
     *  html: Html to inject
     *  url: URL to inject content from
     *  promise: Promise object to get content from
     *  className: CSS class to add to element
     *  parent: Element to inject modal (as query expression)
     *  escapable: True to allow user to close via escape button (default)
     *  animation: {
     *   in: "fadeIn" | "pulseIn" | "zoomIn"
     *   out: "fadeOut" | "pulseOut" | "zooOut"
     *  }
     *  events: {
     *   onopen: function,
     *   onclose: function
     *  }
     *  buttons: [
     *      { title: "Button Title", onclick: function }
     *  ]
     * }
     */
    /* TO DO: Move classname, escapable, etc into an 'options' property */
    constructor({id, title, html, url, parent, className, escapable = true, animation = {}, events = {}, buttons = [], promise }) {

        // Arguments
        this.id = (id || new Date().getTime());
        this.dialogId = "dialog-" + this.id;	// ID for Dialog Element
        this.modalId = "modal-" + this.id;	// Generated ID for parent Modal
        this.title = title;
        this.html = html;
        this.url = url;
        this.promise = promise;
        this.parent = parent ? (typeof parent === 'object' ? parent : document.querySelector(parent)) : document.body;
        this.className = className;
        this.modalObj;
        this.loaderObj;
        this.buttons = buttons;
        this.escapable = escapable;

        this.animation = {
            in: animation.in || "fadeIn",
            out: animation.out || "fadeOut"
        };

        this.events = {
            onopen: events.onopen,
            onclose: events.onclose
        };

        // Public Properties
        this.dialogElement = null;


        this._renderDialog();
        this._attachEvents();
        this._registerEventListeners();
        this._exportObjInstance();

    }


    get close() {
        return this._close;
    }

    get centerVertically() {
        return this._centerVertically;
    }


    /**
     * Save reference to instantiated dialog's to window
     * so can access to object through DOM
     * @private
     */
    _exportObjInstance() {
        window['FlowUI'] = window['FlowUI'] || {};
        window['FlowUI']._dialogs = window['FlowUI']._dialogs || {};
        window['FlowUI']._dialogs[this.id] = this;
    }


    /**
     * Render Modal
     * @private
     */
     _renderModal() {

        // Check if modal already exists for parent
        const existingModal = this.parent.getElementsByClassName('flowui-modal')[0];
        if (existingModal) {
            this.modalObj = window['FlowUI']._modals[existingModal.id];
            this.modalId = existingModal.id;
        }
        // Otherwise, create new instance
        else {
            this.modalObj = new window['FlowUI'].Modal({
                id: this.modalId
            });
        }


        // If dialog content requires http request, show loader before rendering
        if (this.url || this.promise) {
            this.loaderObj = new window['FlowUI'].Loader({
                modalId: this.modalId
            });
        }

    }


    /**
     * Get Dialog Content (Async)
     * @private
     */
    _getContent() {

        // If promise provided during instantiation, use promise object instead to get content
        if (this.promise) {
            return this.promise;
        }

        let _this = this;

        return new Promise(function(resolve, reject) {

            // Static content provided as property
            if (_this.html) {
                resolve(_this.html);
            }

            // Content from a partial or template retreived via http
            else if (_this.url) {

                // Do the usual XHR stuff
                var req = new XMLHttpRequest();
                req.open('GET', _this.url);

                req.onload = function() {
                    if (req.status == 200) {
                        // Resolve the promise with the response text
                        resolve(req.response);
                    }
                    else {
                        reject(Error(req.statusText));
                    }
                };

                req.onerror = function() {
                    reject(Error("Network Error"));
                };

                req.send();

            }
        });

    }

    /**
     * Render Dialog
     * @private
     */
    _renderDialog() {

        this._renderModal();

        // Render Container
        let container = document.createElement("div");
        container.setAttribute('id', this.dialogId);
        container.setAttribute('class', 'flowui-dialog animated ' + (this.className ? this.className : ''));
        //container.style.display = "none";

        // Render Content Wrapper
        let contentWrapper = document.createElement('div');
        contentWrapper.setAttribute('class', 'content');
        if (this.title) {
            let title = document.createElement('div');
            title.setAttribute('class', 'title');
            title.innerHTML = this.title;
            contentWrapper.appendChild(title);
        }

        // Render Inner Content
        let content = document.createElement('div');
        this._getContent().then((html) => {
            content.innerHTML = html;
            this._centerVertically();
        });
        content.setAttribute('class', 'inner-content');
        contentWrapper.appendChild(content);

        // Render Close Button
        let closeButtonElement = document.createElement('a');
        closeButtonElement.onclick = this._close.bind(this);
        closeButtonElement.className = "close";
        contentWrapper.appendChild(closeButtonElement);

        // Render Buttons
        if (this.buttons) {
            let buttonsWrapper = document.createElement('div');
            buttonsWrapper.setAttribute('class', 'buttons');
            let x = 0;
            this.buttons.forEach(function(button) {
                let buttonElement = document.createElement("a");
                buttonElement.setAttribute('class', 'flowui-button button' + x++ + ' ' + (button.className || ''));
                buttonElement.innerHTML = button.title;
                buttonElement.onclick = button.onclick;
                buttonsWrapper.appendChild(buttonElement);
            });
            contentWrapper.appendChild(buttonsWrapper);
        }

        container.appendChild(contentWrapper);

        // Add to modal
        let modalElement = document.getElementById(this.modalObj.id);
        modalElement.appendChild(container);

        // Store dialog element to global property
        this.dialogElement = container;

        // Once content loaded, display
        this._getContent().then(() => {

            // Hide Loader
            if (this.loaderObj) {
                this.loaderObj.close(false);
            }

            this._centerVertically();
            this._focus();
        });


    }

    /**
     * Centre Dialog Vertically in Viewport
     * @private
     */
    _centerVertically() {

        let dialogElement = document.getElementById(this.dialogId);
        const modalHeight = document.getElementById(this.modalId).offsetHeight;
        const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const dialogHeight = dialogElement.offsetHeight;
        const dialogWidth = dialogElement.offsetWidth;
        const scrollPosition = window.scrollY;

        // X & Y Coordinates
        const x = (viewportWidth / 2) - (dialogWidth / 2);
        const y = scrollPosition + (viewportHeight / 2) - (dialogHeight / 2);


        dialogElement.style.top = y + 'px';
        dialogElement.style.left = 'calc(50% - '+ (dialogWidth/2) +'px)';

    }



    /**
     * Handle Closing Dialog and removing from DOM
     * @private
     */
    _close() {

        if (this.events.onclose) {
            this.events.onclose();
        }
        this._setState('closed');
        this._dispose();

        // Only close modal if there's no other dialogs using it
        const modalHasChildDialogs = () =>
        {
            for (const key in window['FlowUI']._dialogs) {
                let dialog = window['FlowUI']._dialogs[key];
                if (dialog.modalId == this.modalId) {
                    return true;
                }
            }
            return false;
        }

        if (!modalHasChildDialogs()) {
            this.modalObj.close();
        }



    }


    /**
     * Remove instance from global window scope and check if another dialog
     * should be made active
     * @private
     */
    _dispose() {

        // TO DO: Element from Remove from DOM
        setTimeout(()=> {
            this.dialogElement.parentNode.removeChild(this.dialogElement);
        }, 1000);


        if (window['FlowUI']._dialogs[this.id]) {
            delete window['FlowUI']._dialogs[this.id];
        }
        this._reactivatePreviousDiaog();
    }

    /**
     * Reactives previous dialog (if any)
     * @private
     */
    _reactivatePreviousDiaog() {
        let allDialogs = window['FlowUI']._dialogs;
        let previousDialog = allDialogs[Object.keys(allDialogs)[Object.keys(allDialogs).length - 1]]
        if (previousDialog) {
            setTimeout(() => {
                previousDialog._focus();
            }, 500);
        }
    }


    /**
     * Handle Dialog State Change (focus, inactive, dismissed)
     * @param e
     * @returns {string}
     * @private
     */
    _onStateChange(e) {

        // Strip out any animation-in/out classes
        let normalizeClasses = () => {
            let classes = document.getElementById(this.dialogId).className.trim().split(' ');
            let normalized = [];
            classes.forEach((className) => {
                if (className != this.animation.in && className != this.animation.out && className != 'inactiveOut')
            {
                normalized.push(className);
            }
        });
            return normalized.join(' ');
        }

        let className = normalizeClasses();

        document.getElementById(this.dialogId).setAttribute("state", e.detail.status);

        switch (e.detail.status) {
            case 'active':
                document.getElementById(this.dialogId).className =  "flowui-dialog animated " + this.animation.in;
                break;
            case 'inactive':
                if (Object.keys(window['FlowUI']._dialogs).length > 1) {
                    document.getElementById(this.dialogId).className = "flowui-dialog animated " + this.animation.out;
                    break;
                }
                document.getElementById(this.dialogId).className = "flowui-dialog animated " + this.animation.out;
                break;
            case 'closed':
                document.getElementById(this.dialogId).className = "flowui-dialog animated " + this.animation.out;
                break;
            default:
                // catch all
        }

    }

    /**
     * Set Dialog State (active, inactive)
     * @private
     */
    _setState(state) {

        var event = new CustomEvent("stateChange", { detail: { status: state } });
        this.dialogElement.dispatchEvent(event);

    }




    /**
     * Sets active dialog, and inactivates others
     * @private
     */
    _focus() {

        let _this = this;
        this._setState("active");

        let allDialogs = window['FlowUI'] ? window['FlowUI']._dialogs : {};
        for (var key in allDialogs) {
            var dialog = allDialogs[key];
            if (dialog.dialogId != _this.dialogId) {
                dialog._setState("inactive");
            }
        }
    }

    /**
     * Bind any necessary events
     * @private
     */
    _attachEvents() {

        // Allow user to hit escape to close window (unless overwritten by param)
        if (this.escapable) {
            window.addEventListener("keyup", (event) => {
                this._close();
            });
        }

    }


    /**
     * Register for any event listeners
     * @private
     */
    _registerEventListeners() {

        // Listen for dialog state change event
        this.dialogElement.addEventListener('stateChange', this._onStateChange.bind(this), false);

    }


}

