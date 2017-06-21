/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native wrapper for accessibility helper.
*/
"use strict";
const RN = require("react-native");
const Accessibility_1 = require("../common/Accessibility");
class Accessibility extends Accessibility_1.Accessibility {
    constructor() {
        super();
        this._isScreenReaderEnabled = false;
        let initialStateChanged = false;
        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when screen reader is enabled or disabled.
            RN.AccessibilityInfo.addEventListener('change', isEnabled => {
                initialStateChanged = true;
                this._updateScreenReaderStatus(isEnabled);
            });
            // Fetch initial state.
            RN.AccessibilityInfo.fetch().then(isEnabled => {
                if (!initialStateChanged) {
                    this._updateScreenReaderStatus(isEnabled);
                }
            });
        }
    }
    _updateScreenReaderStatus(isEnabled) {
        if (this._isScreenReaderEnabled !== isEnabled) {
            this._isScreenReaderEnabled = isEnabled;
            this.screenReaderChangedEvent.fire(isEnabled);
        }
    }
    isScreenReaderEnabled() {
        return this._isScreenReaderEnabled;
    }
}
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Accessibility();
