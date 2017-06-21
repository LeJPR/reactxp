/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of App API namespace.
*/
"use strict";
const RN = require("react-native");
const RootView_1 = require("./RootView");
const RX = require("../common/Interfaces");
const Types = require("../common/Types");
const _rnStateToRxState = {
    'active': Types.AppActivationState.Active,
    'background': Types.AppActivationState.Background,
    'inactive': Types.AppActivationState.Inactive,
    // uninitialized means in Background on android since last change I did
    'uninitialized': Types.AppActivationState.Background
};
class App extends RX.App {
    constructor() {
        super();
        RN.AppState.addEventListener('change', (newState) => {
            // Fall back to active if a new state spits out that we don't know about
            this.activationStateChangedEvent.fire(_rnStateToRxState[newState] || Types.AppActivationState.Active);
        });
        RN.AppState.addEventListener('memoryWarning', () => {
            this.memoryWarningEvent.fire();
        });
    }
    initialize(debug, development) {
        super.initialize(debug, development);
        window['rxdebug'] = debug;
        RN.AppRegistry.registerComponent('RXApp', () => RootView_1.RootView);
    }
    getActivationState() {
        return _rnStateToRxState[RN.AppState.currentState];
    }
}
exports.App = App;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new App();
