/**
* NavigatorStandardDelegate.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Delegate which encapsulates standard react-native Navigator experience.
*/
"use strict";
const _ = require("./lodashMini");
const React = require("react");
const RN = require("react-native");
const NavigatorCommon_1 = require("./NavigatorCommon");
const Types = require("../common/Types");
class NavigatorStandardDelegate extends NavigatorCommon_1.NavigatorDelegate {
    constructor(navigator) {
        super(navigator);
        // Callback from Navigator.js to RX.Navigator
        this._renderScene = (route, navigator) => {
            // route exists?
            if (route) {
                // call the renderScene callback sent from SkypeXNavigator
                return this._owner.props.renderScene(route);
            }
            // no route? return empty scene
            return React.createElement(RN.View, null);
        };
        // Returns object from RN.Navigator.SceneConfigs types (looks like NavigatorSceneConfig for web)
        this._configureNativeScene = (route, routeStack) => {
            // route exists?
            if (route) {
                switch (route.sceneConfigType) {
                    case Types.NavigatorSceneConfigType.FloatFromRight:
                        return RN.Navigator.SceneConfigs.FloatFromRight;
                    case Types.NavigatorSceneConfigType.FloatFromLeft:
                        return RN.Navigator.SceneConfigs.FloatFromLeft;
                    case Types.NavigatorSceneConfigType.FloatFromBottom:
                        return RN.Navigator.SceneConfigs.FloatFromBottom;
                    case Types.NavigatorSceneConfigType.Fade:
                        // FadeAndroid is also supported on iOS.
                        return RN.Navigator.SceneConfigs.FadeAndroid;
                    case Types.NavigatorSceneConfigType.FadeWithSlide:
                        // TODO: Task http://skype.vso.io/544843 - Implement the FadeWithSlide animation for RN
                        // FadeAndroid is also supported on iOS.
                        return RN.Navigator.SceneConfigs.FadeAndroid;
                    default:
                        return RN.Navigator.SceneConfigs.FloatFromRight;
                }
            }
        };
        this._onRouteWillFocus = (route) => {
            if (!this._navigator) {
                return;
            }
            // Check if we've popped via gesture.  This is kind of gross, but RN doesn't
            // provide an interface we can use to check this
            if (this._navigator.state.activeGesture !== 'pop') {
                return;
            }
            const currentRoutes = this._navigator.getCurrentRoutes();
            const focusIndex = _.findIndex(currentRoutes, currRoute => route.routeId === currRoute.routeId);
            if (focusIndex === -1) {
                // Not found, nothing to do
                return;
            }
            if (this._owner.props.transitionStarted) {
                this._owner.props.transitionStarted();
            }
            if (focusIndex === currentRoutes.length - 2) {
                // A swipe-back pop occurred since we're focusing the view 1 below the top
                if (this._owner.props.navigateBackCompleted) {
                    this._owner.props.navigateBackCompleted();
                }
            }
        };
        this._onRouteDidFocus = (route) => {
            if (this._owner.props.transitionCompleted) {
                this._owner.props.transitionCompleted();
            }
        };
    }
    getRoutes() {
        return (this._navigator && this._navigator.getCurrentRoutes()) || [];
    }
    // Reset route stack with default route stack
    immediatelyResetRouteStack(nextRouteStack) {
        this._navigator.immediatelyResetRouteStack(nextRouteStack);
    }
    render() {
        return (React.createElement(RN.Navigator, { renderScene: this._renderScene, configureScene: this._configureNativeScene, sceneStyle: this._owner.props.cardStyle, onWillFocus: this._onRouteWillFocus, onDidFocus: this._onRouteDidFocus, ref: (navigator) => this._navigator = navigator }));
    }
    // Try to remove this handling by scheduling as it's done in experimental
    handleBackPress() {
        this._navigator.pop();
    }
    processCommand(commandQueue) {
        // Return if nothing to process
        if (!this._navigator || !commandQueue.length) {
            return;
        }
        let command = commandQueue.shift();
        let route = command.param.route;
        let value = command.param.value;
        switch (command.type) {
            case NavigatorCommon_1.CommandType.Push:
                // console.log('[Navigator] <== push(route)');
                this._navigator.push(route);
                break;
            case NavigatorCommon_1.CommandType.Pop:
                if (route !== undefined) {
                    // console.log(`[Navigator] <== popToRoute(${this._findIOSRouteIndex(route)})`);
                    this._navigator.popToRoute(route);
                }
                else if (value !== undefined) {
                    // console.log(`[Navigator] <== ${value > 0 ? 'popN' : 'popToTop'}(${value}))`);
                    if (value > 0) {
                        var popCount = value;
                        while (popCount > 0) {
                            this._navigator.pop();
                            popCount--;
                        }
                    }
                    else {
                        this._navigator.popToTop();
                    }
                }
                else {
                    // console.log(`[Navigator] <== pop()`);
                    this._navigator.pop();
                }
                break;
            case NavigatorCommon_1.CommandType.Replace:
                // console.log(`[Navigator] <== replace(${this._findIOSRouteIndex(route)}, ${value})`);
                value === -1 ? this._navigator.replacePrevious(route) : this._navigator.replace(route);
                break;
            default:
                console.error('Undefined Navigation command: ', command.type);
                break;
        }
    }
}
exports.NavigatorStandardDelegate = NavigatorStandardDelegate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NavigatorStandardDelegate;
