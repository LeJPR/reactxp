/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform status bar.
*/
"use strict";
const RX = require("../common/Interfaces");
class StatusBar extends RX.StatusBar {
    isOverlay() {
        return false;
    }
    setBarStyle(style, animated) {
        // Nothing to do on Web
    }
    setHidden(hidden, showHideTransition) {
        // Nothing to do on Web
    }
    setNetworkActivityIndicatorVisible(value) {
        // Nothing to do on the web
    }
    setBackgroundColor(color, animated) {
        // Nothing to do on the web
    }
    setTranslucent(translucent) {
        // Nothing to do on the web
    }
}
exports.StatusBar = StatusBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StatusBar();
