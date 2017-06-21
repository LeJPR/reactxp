/**
* FrontLayerViewManager.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages the layering of the main view, modals and popups.
*/
"use strict";
const React = require("react");
const ReactDOM = require("react-dom");
const RootView_1 = require("./RootView");
class FrontLayerViewManager {
    constructor() {
        this._mainView = null;
        this._HOC = null;
        this._modalStack = [];
        this._activePopupOptions = null;
        this._activePopupId = null;
        this._activePopupAutoDismiss = false;
        this._activePopupAutoDismissDelay = 0;
        this._activePopupShowDelay = 0;
        this._popupShowDelayTimer = null;
        this._shouldPopupBeDismissed = (options) => {
            return this._activePopupOptions &&
                this._activePopupOptions.getAnchor() === options.getAnchor();
        };
    }
    setMainView(element) {
        this._mainView = element;
        this._renderRootView();
    }
    setHOC(hocFunction) {
        this._HOC = hocFunction;
        this._renderRootView();
    }
    isModalDisplayed(modalId) {
        return this._modalStack.some(d => d.id === modalId);
    }
    showModal(modal, modalId) {
        if (!modalId) {
            console.error('modal must have valid ID');
        }
        // Dismiss any active popups.
        if (this._activePopupOptions) {
            this.dismissPopup(this._activePopupId);
        }
        this._modalStack.push({ modal: modal, id: modalId });
        this._renderRootView();
    }
    dismissModal(modalId) {
        this._modalStack = this._modalStack.filter(d => d.id !== modalId);
        this._renderRootView();
    }
    dismissAllModals() {
        if (this._modalStack.length > 0) {
            this._modalStack = [];
            this._renderRootView();
        }
    }
    showPopup(options, popupId, showDelay) {
        // If options.dismissIfShown is true, calling this methos will behave like a toggle. On one call, it will open the popup.
        // If it is called when pop up is seen, it will dismiss the popup.
        // If options.dismissIfShown is false, we will simply show the popup always.
        if (options.dismissIfShown) {
            if (this._shouldPopupBeDismissed(options)) {
                this.dismissPopup(popupId);
                return false;
            }
        }
        this._showPopup(options, popupId, showDelay);
        return true;
    }
    _showPopup(options, popupId, showDelay) {
        if (this._activePopupOptions) {
            if (this._activePopupOptions.onDismiss) {
                this._activePopupOptions.onDismiss();
            }
        }
        if (this._popupShowDelayTimer) {
            clearTimeout(this._popupShowDelayTimer);
            this._popupShowDelayTimer = null;
        }
        this._activePopupOptions = options;
        this._activePopupId = popupId;
        this._activePopupAutoDismiss = false;
        this._activePopupAutoDismissDelay = 0;
        this._activePopupShowDelay = showDelay || 0;
        this._renderRootView();
        if (this._activePopupShowDelay > 0) {
            this._popupShowDelayTimer = window.setTimeout(() => {
                this._activePopupShowDelay = 0;
                this._popupShowDelayTimer = null;
                this._renderRootView();
            }, this._activePopupShowDelay);
        }
    }
    autoDismissPopup(popupId, dismissDelay) {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._popupShowDelayTimer) {
                clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = null;
            }
            this._activePopupAutoDismiss = true;
            this._activePopupAutoDismissDelay = dismissDelay || 0;
            this._renderRootView();
        }
    }
    dismissPopup(popupId) {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._activePopupOptions.onDismiss) {
                this._activePopupOptions.onDismiss();
            }
            if (this._popupShowDelayTimer) {
                clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = null;
            }
            this._activePopupOptions = null;
            this._activePopupId = null;
            this._renderRootView();
        }
    }
    dismissAllPopups() {
        this.dismissPopup(this._activePopupId);
    }
    _renderRootView() {
        let topModal = this._modalStack.length > 0 ?
            this._modalStack[this._modalStack.length - 1].modal : null;
        let rootView = (React.createElement(RootView_1.RootView, { mainView: this._mainView, keyBoardFocusOutline: this._mainView.props.keyBoardFocusOutline, mouseFocusOutline: this._mainView.props.mouseFocusOutline, modal: topModal, activePopupOptions: this._activePopupShowDelay > 0 ? null : this._activePopupOptions, autoDismiss: this._activePopupAutoDismiss, autoDismissDelay: this._activePopupAutoDismissDelay, onDismissPopup: () => this.dismissPopup(this._activePopupId) }));
        if (this._HOC) {
            rootView = this._HOC(rootView);
        }
        const container = document.getElementsByClassName('app-container')[0];
        ReactDOM.render(rootView, container);
    }
}
exports.FrontLayerViewManager = FrontLayerViewManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new FrontLayerViewManager();
