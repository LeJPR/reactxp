/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of StatusBar APIs.
*/
"use strict";
const RN = require("react-native");
const RX = require("../common/Interfaces");
class StatusBar extends RX.StatusBar {
    isOverlay() {
        // Android draws the status bar as a view that takes up space
        // of its own, as opposed to an overlay like on iOS.
        return false;
    }
    setHidden(hidden, showHideTransition) {
        RN.StatusBar.setHidden(hidden, showHideTransition);
    }
    setBackgroundColor(color, animated) {
        RN.StatusBar.setBackgroundColor(color, animated);
    }
    setTranslucent(translucent) {
        RN.StatusBar.setTranslucent(translucent);
    }
    setBarStyle(style, animated) {
        // Nothing to do on android
    }
    setNetworkActivityIndicatorVisible(value) {
        // Nothing to do on android
    }
}
exports.StatusBar = StatusBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StatusBar();
