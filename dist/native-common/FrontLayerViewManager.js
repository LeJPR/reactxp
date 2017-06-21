/**
* FrontLayerViewManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages stackable modals and popup views that are posted and dismissed
* by the Types showModal/dismissModal/showPopup/dismissPopup methods.
*/
"use strict";
const _ = require("./lodashMini");
const React = require("react");
const RN = require("react-native");
const ModalContainer_1 = require("../native-common/ModalContainer");
const SubscribableEvent = require("../common/SubscribableEvent");
const PopupContainerView_1 = require("./PopupContainerView");
class ModalStackContext {
    constructor(modalId, modal) {
        this.modalId = modalId;
        this.modal = modal;
    }
}
class PopupStackContext {
    constructor(popupId, popupOptions, anchorHandle) {
        this.popupId = popupId;
        this.popupOptions = popupOptions;
        this.anchorHandle = anchorHandle;
    }
}
const _styles = {
    fullScreenView: {
        flex: 1,
        alignSelf: 'stretch',
        overflow: 'visible'
    }
};
class FrontLayerViewManager {
    constructor() {
        this._overlayStack = [];
        this.event_changed = new SubscribableEvent.SubscribableEvent();
        this._onBackgroundPressed = (e) => {
            e.persist();
            const activePopupContext = this._getActiveOverlay();
            if (!(activePopupContext instanceof PopupStackContext)) {
                return;
            }
            if (activePopupContext.popupOptions && activePopupContext.popupOptions.onAnchorPressed) {
                RN.NativeModules.UIManager.measureInWindow(activePopupContext.anchorHandle, (x, y, width, height, pageX, pageY) => {
                    const touchEvent = e.nativeEvent;
                    let anchorRect = { left: x, top: y, right: x + width, bottom: y + height, width: width, height: height };
                    // Find out if the press event was on the anchor so we can notify the caller about it.
                    if (touchEvent.pageX >= anchorRect.left && touchEvent.pageX < anchorRect.right
                        && touchEvent.pageY >= anchorRect.top && touchEvent.pageY < anchorRect.bottom) {
                        // Showing another animation while dimissing the popup creates a conflict in the UI making it not doing one of the
                        // two animations (i.e.: Opening an actionsheet while dismissing a popup). We introduce this delay to make sure
                        // the popup dimissing animation has finished before we call the event handler.
                        setTimeout(() => { activePopupContext.popupOptions.onAnchorPressed(e); }, 500);
                    }
                });
            }
            this._dismissActivePopup();
        };
        this._onRequestClose = () => {
            this._dismissActivePopup();
        };
    }
    showModal(modal, modalId) {
        const index = this._findIndexOfModal(modalId);
        if (index === -1) {
            this._overlayStack.push(new ModalStackContext(modalId, modal));
            this.event_changed.fire();
        }
    }
    isModalDisplayed(modalId) {
        return this._findIndexOfModal(modalId) !== -1;
    }
    dismissModal(modalId) {
        const index = this._findIndexOfModal(modalId);
        if (index >= 0) {
            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    }
    dismissAllmodals() {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, iter => !(iter instanceof ModalStackContext));
            this.event_changed.fire();
        }
    }
    showPopup(popupOptions, popupId, delay) {
        if (!popupId || popupId === '') {
            console.error('FrontLayerViewManager: popupId must be valid!');
            return false;
        }
        if (!popupOptions.getAnchor()) {
            console.error('FrontLayerViewManager: getAnchor() must be valid!');
            return false;
        }
        const index = this._findIndexOfPopup(popupId);
        if (index === -1) {
            this._overlayStack.push(new PopupStackContext(popupId, popupOptions, RN.findNodeHandle(popupOptions.getAnchor())));
            this.event_changed.fire();
            return true;
        }
        return false;
    }
    dismissPopup(popupId) {
        const index = this._findIndexOfPopup(popupId);
        if (index >= 0) {
            const popupContext = this._overlayStack[index];
            if (popupContext.popupOptions.onDismiss) {
                popupContext.popupOptions.onDismiss();
            }
            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    }
    dismissAllPopups() {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, iter => !(iter instanceof PopupStackContext));
            this.event_changed.fire();
        }
    }
    getModalLayerView(rootView) {
        const overlayContext = _.findLast(this._overlayStack, context => context instanceof ModalStackContext);
        if (overlayContext) {
            return (React.createElement(ModalContainer_1.ModalContainer, null, overlayContext.modal));
        }
        return null;
    }
    getPopupLayerView(rootView) {
        const overlayContext = _.findLast(this._overlayStack, context => context instanceof PopupStackContext);
        if (overlayContext) {
            return (React.createElement(ModalContainer_1.ModalContainer, null,
                React.createElement(RN.TouchableWithoutFeedback, { onPressOut: this._onBackgroundPressed, importantForAccessibility: 'no' },
                    React.createElement(RN.View, { style: _styles.fullScreenView },
                        React.createElement(PopupContainerView_1.default, { activePopupOptions: overlayContext.popupOptions, anchorHandle: overlayContext.anchorHandle, onDismissPopup: () => this.dismissPopup(overlayContext.popupId) })))));
        }
        return null;
    }
    _dismissActivePopup() {
        // Dismiss any currently visible popup:
        const activePopupContext = this._getActiveOverlay();
        if (activePopupContext instanceof PopupStackContext) {
            this.dismissPopup(activePopupContext.popupId);
        }
    }
    _findIndexOfModal(modalId) {
        return _.findIndex(this._overlayStack, (iter) => iter instanceof ModalStackContext && iter.modalId === modalId);
    }
    _findIndexOfPopup(popupId) {
        return _.findIndex(this._overlayStack, (iter) => iter instanceof PopupStackContext && iter.popupId === popupId);
    }
    _getActiveOverlay() {
        // Check for any Popup in queue
        return this._overlayStack.length === 0 ? null : _.last(this._overlayStack);
    }
}
exports.FrontLayerViewManager = FrontLayerViewManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new FrontLayerViewManager();
