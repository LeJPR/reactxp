/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements App interface for ReactXP.
*/
"use strict";
const RX = require("../common/Interfaces");
const Types = require("../common/Types");
if (typeof (document) !== 'undefined') {
    var ifvisible = require('ifvisible.js');
}
class App extends RX.App {
    constructor() {
        super();
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            this._activationState = ifvisible.now() ? Types.AppActivationState.Active : Types.AppActivationState.Background;
            ifvisible.on('focus', () => {
                if (this._activationState !== Types.AppActivationState.Active) {
                    this._activationState = Types.AppActivationState.Active;
                    this.activationStateChangedEvent.fire(this._activationState);
                }
            });
            ifvisible.on('blur', () => {
                if (this._activationState !== Types.AppActivationState.Background) {
                    this._activationState = Types.AppActivationState.Background;
                    this.activationStateChangedEvent.fire(this._activationState);
                }
            });
        }
    }
    initialize(debug, development) {
        super.initialize(debug, development);
        window['rxdebug'] = debug;
    }
    getActivationState() {
        return this._activationState;
    }
}
exports.App = App;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new App();
