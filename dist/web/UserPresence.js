/**
* UserPresence.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the ReactXP interfaces related to
* user presence.
*/
"use strict";
const RX = require("../common/Interfaces");
if (typeof (document) !== 'undefined') {
    var ifvisible = require('ifvisible.js');
}
class UserPresence extends RX.UserPresence {
    constructor() {
        super();
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            this._isPresent = ifvisible.now();
            ifvisible.on('wakeup', this._handleWakeup.bind(this));
            ifvisible.on('idle', this._handleIdle.bind(this));
            ifvisible.on('focus', this._handleFocus.bind(this));
            ifvisible.on('blur', this._handleBlur.bind(this));
            window.addEventListener('blur', this._handleBlur.bind(this));
            window.addEventListener('focus', this._handleFocus.bind(this));
        }
    }
    isUserPresent() {
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            return ifvisible.now();
        }
        else {
            return true;
        }
    }
    _setUserPresent(isPresent) {
        if (this._isPresent !== isPresent) {
            this._isPresent = isPresent;
            this.userPresenceChangedEvent.fire(isPresent);
        }
    }
    _handleWakeup() {
        this._setUserPresent(true);
    }
    _handleIdle() {
        this._setUserPresent(false);
    }
    _handleFocus() {
        this._setUserPresent(true);
    }
    _handleBlur() {
        this._setUserPresent(false);
    }
}
exports.UserPresence = UserPresence;
var instance = new UserPresence();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = instance;
