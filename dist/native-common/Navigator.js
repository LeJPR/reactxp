/**
* Navigator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common native implementation for Navigator on mobile.
*/
"use strict";
const RN = require("react-native");
const RX = require("../common/Interfaces");
const Input_1 = require("./Input");
const NavigatorCommon_1 = require("./NavigatorCommon");
const NavigatorStandardDelegate_1 = require("./NavigatorStandardDelegate");
const NavigatorExperimentalDelegate_1 = require("./NavigatorExperimentalDelegate");
class Navigator extends RX.Navigator {
    constructor(initialProps) {
        super(initialProps);
        this._commandQueue = [];
        if (RN.Platform.OS === 'android' || RN.Platform.OS === 'ios') {
            this._delegate = new NavigatorExperimentalDelegate_1.default(this);
        }
        else {
            this._delegate = new NavigatorStandardDelegate_1.default(this);
        }
    }
    componentDidMount() {
        Input_1.default.backButtonEvent.subscribe(this._delegate.onBackPress);
    }
    componentWillUnmount() {
        Input_1.default.backButtonEvent.unsubscribe(this._delegate.onBackPress);
    }
    componentDidUpdate() {
        // Catch up with any pending commands
        this._processCommand();
    }
    getRoutes() {
        return this._delegate.getRoutes();
    }
    // Push a new route if initial route doesn't exist
    push(route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Push,
            param: {
                route: route
            }
        });
    }
    pop() {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Pop,
            param: {}
        });
    }
    replace(route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Replace,
            param: {
                route: route
            }
        });
    }
    replacePrevious(route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Replace,
            param: {
                route: route,
                value: -1
            }
        });
    }
    // This method replaces the route at the given index of the stack and pops to that index.
    replaceAtIndex(route, index) {
        let routes = this.getRoutes();
        // Pop to index route and then replace if not last one
        if (index < routes.length - 1) {
            let route = routes[index];
            this.popToRoute(route);
        }
        // Schedule a replace
        this.replace(route);
    }
    // Reset route stack with default route stack
    immediatelyResetRouteStack(nextRouteStack) {
        this._delegate.immediatelyResetRouteStack(nextRouteStack);
    }
    popToRoute(route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Pop,
            param: {
                route: route
            }
        });
    }
    popToTop() {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Pop,
            param: {
                value: -1
            }
        });
    }
    getCurrentRoutes() {
        return this.getRoutes();
    }
    // Render without initial route to get a reference for Navigator object
    render() {
        return this._delegate.render();
    }
    _enqueueCommand(command) {
        this._commandQueue.push(command);
        this._processCommand();
    }
    _processCommand() {
        this._delegate.processCommand(this._commandQueue);
    }
}
exports.Navigator = Navigator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navigator;
