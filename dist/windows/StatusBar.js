/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of StatusBar APIs.
*/
"use strict";
const RX = require("../common/Interfaces");
class StatusBar extends RX.StatusBar {
    isOverlay() {
        // We currently only care about Windows desktop which doesn't have a
        // status bar.
        return false;
    }
    setHidden(hidden, showHideTransition) {
        // Nothing to do on Windows
    }
    setBackgroundColor(color, animated) {
        // Nothing to do on Windows
    }
    setTranslucent(translucent) {
        // Nothing to do on Windows
    }
    setBarStyle(style, animated) {
        // Nothing to do on Windows
    }
    setNetworkActivityIndicatorVisible(value) {
        // Nothing to do on Windows
    }
}
exports.StatusBar = StatusBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StatusBar();
