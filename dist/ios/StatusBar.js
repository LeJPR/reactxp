/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific implementation of StatusBar APIs.
*/
"use strict";
const RN = require("react-native");
const RX = require("../common/Interfaces");
class StatusBar extends RX.StatusBar {
    isOverlay() {
        // iOS always draws the status bar as an overlay, as opposed
        // to a view that takes up space of its own.
        return true;
    }
    setBarStyle(style, animated) {
        RN.StatusBar.setBarStyle(style, true);
    }
    setHidden(hidden, showHideTransition) {
        RN.StatusBar.setHidden(hidden, showHideTransition);
    }
    setNetworkActivityIndicatorVisible(value) {
        RN.StatusBar.setNetworkActivityIndicatorVisible(value);
    }
    setBackgroundColor(color, animated) {
        // Nothing to do on iOS
    }
    setTranslucent(translucent) {
        // Nothing to do on iOS
    }
}
exports.StatusBar = StatusBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StatusBar();
