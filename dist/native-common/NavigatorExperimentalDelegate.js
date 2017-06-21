/**
* NavigatorExperimentalDelegate.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Delegate which encapsulates experimental react-native Navigator experience.
* The main difference of Experimental Navigator is that it uses Animated for navigation animation
* so we can enable useNativeDriver options for those animations.
*
* Currently, Android support on NativeAnimations is more stable and performant than iOS.
* That's why we need to have the ability to pick different implementations for different platforms.
*/
"use strict";
const _ = require("./lodashMini");
const assert = require("assert");
const React = require("react");
const RN = require("react-native");
const NavigatorCommon_1 = require("./NavigatorCommon");
var Navigation = RN.NavigationExperimental;
const Types = require("../common/Types");
const StateUtils = Navigation.StateUtils;
class NavigatorExperimentalDelegate extends NavigatorCommon_1.NavigatorDelegate {
    constructor(navigator) {
        super(navigator);
        this._onTransitionEnd = () => {
            this._transitionSpec = this._buildTransitionSpec(this._state);
            console.log('onTransitionEnd', this._transitionSpec);
            this._owner.setState({ state: this._state });
            if (this._owner.props.transitionCompleted) {
                this._owner.props.transitionCompleted();
            }
        };
        this._onTransitionStart = (transitionProps, prevTransitionProps) => {
            console.log('onTransitionStart', this._transitionSpec);
            if (this._owner.props.transitionStarted) {
                const fromIndex = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.index : null;
                const toIndex = transitionProps.scene ? transitionProps.scene.index : null;
                const fromRouteId = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.route.key : null;
                const toRouteId = transitionProps.scene ? transitionProps.scene.route.key : null;
                this._owner.props.transitionStarted(transitionProps.position, toRouteId, fromRouteId, toIndex, fromIndex);
            }
        };
        // Callback from Navigator.js to RX.Navigator
        this._renderScene = (props, navigator) => {
            let parentState = props.navigationState;
            let sceneState = parentState.routes[props.scene.index];
            // Does the route exist?
            if (sceneState && sceneState.route) {
                // Call the renderScene callback.
                return this._owner.props.renderScene(sceneState.route);
            }
            // No route? Return empty scene.
            return React.createElement(RN.View, null);
        };
        /**
         * This method is going to be deprecated in later releases
        */
        this._onNavigateBack = (action) => {
            this.onBackPress();
        };
        const route = { key: '0', route: { routeId: 0, sceneConfigType: 0 } };
        this._state = { index: 0, routes: [route] };
        this._transitionSpec = this._buildTransitionSpec(this._state);
        console.log('initial transition spec is:', this._transitionSpec);
    }
    getRoutes() {
        return _.map(this._state.routes, element => {
            const routeState = element;
            return routeState.route;
        });
    }
    // Reset route stack with default route stack
    immediatelyResetRouteStack(nextRouteStack) {
        console.log('Stack state before reset:', this._state);
        const prevState = this._state;
        this._state = this._createParentState(nextRouteStack, prevState);
        this._transitionSpec = this._buildTransitionSpec(this._state);
        console.log('Immediate stack reset:', this._state, this._transitionSpec);
        this._owner.setState({ state: this._state });
    }
    // Render without initial route to get a reference for Navigator object
    render() {
        return (React.createElement(Navigation.CardStack, { direction: this._transitionSpec.direction, customTransitionConfig: this._transitionSpec.customTransitionConfig, navigationState: this._state, onNavigateBack: this._onNavigateBack, onTransitionStart: this._onTransitionStart, onTransitionEnd: this._onTransitionEnd, renderScene: this._renderScene, cardStyle: this._transitionSpec.cardStyle || this._owner.props.cardStyle, hideShadow: this._transitionSpec.hideShadow, enableGestures: this._transitionSpec.enableGesture, gestureResponseDistance: this._transitionSpec.gestureResponseDistance }));
    }
    _convertCustomTransitionConfig(config) {
        if (!config) {
            return null;
        }
        let nativeConfig = {
            transitionStyle: config.transitionStyle,
            presentBelowPrevious: config.presentBelowPrevious
        };
        if (config.transitionSpec) {
            let transitionSpec = {};
            if (config.transitionSpec.duration) {
                transitionSpec.duration = config.transitionSpec.duration;
            }
            if (config.transitionSpec.easing) {
                transitionSpec.easing = config.transitionSpec.easing;
            }
            nativeConfig.transitionSpec = transitionSpec;
        }
        return nativeConfig;
    }
    _buildTransitionSpec(state) {
        const route = state.routes[state.index].route;
        let direction = 'horizontal';
        let customSceneConfig = null;
        let enableGesture = null;
        let responseDistance = null;
        let hideShadow = route && route.customSceneConfig && route.customSceneConfig.hideShadow;
        let cardStyle = route && route.customSceneConfig
            ? route.customSceneConfig.cardStyle
            : null;
        let gestureDistanceSet = false;
        if (route) {
            // If defined, use the gestureResponseDistance override
            if (route.gestureResponseDistance !== undefined && route.gestureResponseDistance !== null) {
                responseDistance = route.gestureResponseDistance;
                gestureDistanceSet = true;
            }
            customSceneConfig = this._convertCustomTransitionConfig(route.customSceneConfig);
            switch (route.sceneConfigType) {
                case Types.NavigatorSceneConfigType.FloatFromBottom:
                    direction = 'vertical';
                    if (!gestureDistanceSet) {
                        responseDistance = 150;
                        gestureDistanceSet = true;
                    }
                    break;
                case Types.NavigatorSceneConfigType.Fade:
                case Types.NavigatorSceneConfigType.FadeWithSlide:
                    direction = 'fade';
                    if (!gestureDistanceSet) {
                        responseDistance = 0;
                        gestureDistanceSet = true;
                    }
                    break;
                // Currently we support only right to left animation
                //case Types.NavigatorSceneConfigType.FloatFromRight:
                //case Types.NavigatorSceneConfigType.FloatFromLeft:
                default:
                    break;
            }
        }
        // Fall back to 30 as a default for responseDistance
        if (!gestureDistanceSet) {
            responseDistance = 30;
        }
        // Conditionally enable gestures
        enableGesture = responseDistance > 0;
        return {
            enableGesture: enableGesture,
            gestureResponseDistance: responseDistance,
            direction: direction,
            customTransitionConfig: customSceneConfig,
            cardStyle: cardStyle,
            hideShadow: hideShadow,
        };
    }
    handleBackPress() {
        this._owner.pop();
    }
    processCommand(commandQueue) {
        // Return if nothing to process
        if (!commandQueue.length) {
            return;
        }
        const previousState = this._state;
        let useNewStateAsScene = false;
        let command = commandQueue.shift();
        let route = command.param.route;
        let value = command.param.value;
        console.log('processing navigation command:', JSON.stringify(command), 'on stack:', JSON.stringify(this._state));
        switch (command.type) {
            case NavigatorCommon_1.CommandType.Push:
                useNewStateAsScene = true;
                this._state = StateUtils.push(this._state, this._createState(route));
                break;
            case NavigatorCommon_1.CommandType.Pop:
                if (route !== undefined) {
                    this._state = this._popToRoute(this._state, route);
                }
                else if (value !== undefined) {
                    if (value > 0) {
                        this._state = this._popN(this._state, value);
                    }
                    else {
                        this._state = this._popToTop(this._state);
                    }
                }
                else {
                    this._state = StateUtils.pop(this._state);
                }
                break;
            case NavigatorCommon_1.CommandType.Replace:
                if (value === -1) {
                    this._state = StateUtils.replaceAtIndex(this._state, this._state.routes.length - 2, this._createState(route));
                }
                else {
                    this._state = StateUtils.replaceAtIndex(this._state, this._state.routes.length - 1, this._createState(route));
                }
                break;
            default:
                console.error('Undefined Navigation command: ', command.type);
                break;
        }
        console.log('stack after execution is:', JSON.stringify(this._state));
        if (previousState !== this._state) {
            if (useNewStateAsScene) {
                this._transitionSpec = this._buildTransitionSpec(this._state);
            }
            else {
                this._transitionSpec = this._buildTransitionSpec(previousState);
            }
            console.log('transition spec:', this._transitionSpec, useNewStateAsScene);
            this._owner.setState({ state: this._state });
        }
    }
    _createState(route) {
        return { key: route.routeId.toString(), route: route };
    }
    _createParentState(routes, prevState) {
        const prevRoutes = prevState.routes;
        let children = _.map(routes, (element, index) => {
            if (prevRoutes.length > index) {
                const prevRoute = prevRoutes[index];
                // Navigator state reducer is a little bit naive,
                // let's make sure it's scene rendering caching would work properly
                if (prevRoute.route.routeId === element.routeId) {
                    return prevRoute;
                }
            }
            return this._createState(element);
        });
        return { routes: children, index: routes.length - 1 };
    }
    _popToTop(state) {
        const popCount = state.routes.length - 1;
        if (popCount > 0) {
            return this._popN(state, popCount);
        }
        return state;
    }
    _popN(state, n) {
        assert.ok(n > 0, 'n < 0 please pass positive value');
        const initialRoutes = state.routes;
        const initialLength = initialRoutes.length;
        assert.ok(initialLength >= n, 'navigation stack underflow');
        let result = _.clone(state);
        result.routes = initialRoutes.slice(0, initialLength - n);
        result.index = initialLength - n - 1;
        return result;
    }
    _popToRoute(state, route) {
        let popCount = 0;
        for (let i = state.routes.length - 1; i >= 0; i--) {
            const child = state.routes[i];
            if (route.routeId === child.route.routeId) {
                break;
            }
            else {
                popCount++;
            }
        }
        if (popCount > 0) {
            return this._popN(state, popCount);
        }
        else {
            return state;
        }
    }
}
exports.NavigatorExperimentalDelegate = NavigatorExperimentalDelegate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NavigatorExperimentalDelegate;
