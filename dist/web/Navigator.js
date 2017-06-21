/*
* Navigator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web specific implementation of Navigator. This is inspired from React.Navigator.
* This component is set with props, which are callback methods. It is primarily driven
* by state updates instigated by its public helpers like immediatelyResetRouteStack, push,
* pop, which update the state and cause transitions.
*/
"use strict";
const _ = require("./utils/lodashMini");
const React = require("react");
const ReactDOM = require("react-dom");
const rebound = require("rebound");
const NavigatorSceneConfigFactory_1 = require("./NavigatorSceneConfigFactory");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const View_1 = require("./View");
// Default styles
const _styles = {
    container: Styles_1.default.createViewStyle({
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch',
        overflow: 'hidden'
    }),
    defaultSceneStyle: Styles_1.default.createViewStyle({
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }),
    baseScene: Styles_1.default.createViewStyle({
        position: 'absolute',
        overflow: 'hidden',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }),
    disabledScene: Styles_1.default.createViewStyle({
        top: 0,
        bottom: 0,
        flex: 1
    }),
    transitioner: Styles_1.default.createViewStyle({
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        alignItems: 'stretch'
    }),
    sceneStyle: Styles_1.default.createViewStyle({
        flex: 1,
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 40,
        shadowColor: 'rgba(0, 0, 0, 0.2)'
    })
};
class Navigator extends RX.Navigator {
    // Receives initial props and sets initial state for Navigator
    constructor(initialProps) {
        super(initialProps);
        // Keep a map of all rendered scenes, keyed off their routeId
        this._renderedSceneMap = {};
        // Default navigator state
        this.state = {
            sceneConfigStack: [],
            routeStack: [],
            presentedIndex: 0,
            transitionFromIndex: undefined,
            transitionQueue: []
        };
    }
    componentWillMount() {
        this.springSystem = new rebound.SpringSystem();
        this.spring = this.springSystem.createSpring();
        this.spring.setRestSpeedThreshold(0.05);
        this.spring.setCurrentValue(0).setAtRest();
        this.spring.addListener({
            onSpringUpdate: () => {
                this._handleSpringUpdate();
            },
            onSpringAtRest: () => {
                this._completeTransition();
            }
        });
    }
    componentDidMount() {
        this._updateDimensionsCache();
        this._handleSpringUpdate();
    }
    componentDidUpdate() {
        this._updateDimensionsCache();
    }
    render() {
        let newRenderedSceneMap = {};
        let scenes;
        if (this.state.routeStack.length > 0) {
            scenes = this.state.routeStack.map((route, index) => {
                let renderedScene;
                if (this._renderedSceneMap[route.routeId] &&
                    index !== this.state.presentedIndex) {
                    renderedScene = this._renderedSceneMap[route.routeId];
                }
                else {
                    renderedScene = this._renderNavigatorScene(route, index);
                }
                newRenderedSceneMap[route.routeId] = renderedScene;
                return renderedScene;
            });
        }
        else {
            scenes = [];
        }
        this._renderedSceneMap = _.clone(newRenderedSceneMap);
        return (React.createElement(View_1.default, { key: 'container', style: _styles.container },
            React.createElement(View_1.default, { style: _styles.transitioner, ref: 'transitioner' }, scenes)));
    }
    // Public Navigator Helper methods. These methods modify Navigator state, which kicks of
    // re-renders for the Navigator
    jumpTo(route) {
        const destIndex = this.state.routeStack.indexOf(route);
        this._jumpN(destIndex - this.state.presentedIndex);
    }
    jumpForward() {
        this._jumpN(1);
    }
    jumpBack() {
        this._jumpN(-1);
    }
    push(route) {
        this._invariant(!!route, 'Must supply route to push');
        const activeLength = this.state.presentedIndex + 1;
        const activeStack = this.state.routeStack.slice(0, activeLength);
        const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
        const nextStack = activeStack.concat([route]);
        const destIndex = nextStack.length - 1;
        const nextAnimationConfigStack = activeAnimationConfigStack.concat([
            this._getSceneConfigFromRoute(route)
        ]);
        this.setState({
            routeStack: nextStack,
            sceneConfigStack: nextAnimationConfigStack
        }, () => {
            this._enableScene(destIndex);
            this._transitionTo(destIndex);
        });
    }
    immediatelyResetRouteStack(nextRouteStack) {
        const destIndex = nextRouteStack.length - 1;
        this.setState({
            // Build a sceneConfigStack
            sceneConfigStack: _.map(nextRouteStack, route => this._getSceneConfigFromRoute(route)),
            routeStack: nextRouteStack,
            presentedIndex: destIndex,
            transitionFromIndex: undefined,
            transitionQueue: []
        }, () => {
            this._handleSpringUpdate();
        });
    }
    pop() {
        if (this.state.transitionQueue.length) {
            // This is the workaround to prevent user from firing multiple `pop()` calls that may pop the routes beyond
            // the limit. Because `this.state.presentedIndex` does not update until the transition starts, we can't
            // reliably use `this.state.presentedIndex` to know whether we can safely keep popping the routes or not at
            // this moment.
            return;
        }
        if (this.state.presentedIndex > 0) {
            this._popN(1);
        }
    }
    // This method replaces the route at the given index of the stack and pops to that index.
    replaceAtIndex(route, index) {
        this._invariant(!!route, 'Must supply route to replace');
        if (index < 0) {
            index += this.state.routeStack.length;
        }
        if (this.state.routeStack.length <= index) {
            return;
        }
        let nextRouteStack = this.state.routeStack.slice(0, index + 1);
        let nextAnimationModeStack = this.state.sceneConfigStack.slice(0, index + 1);
        nextRouteStack[index] = route;
        nextAnimationModeStack[index] = this._getSceneConfigFromRoute(route);
        this.setState({
            routeStack: nextRouteStack,
            sceneConfigStack: nextAnimationModeStack
        });
    }
    replace(route) {
        this.replaceAtIndex(route, this.state.presentedIndex);
    }
    replacePrevious(route) {
        this.replaceAtIndex(route, this.state.presentedIndex - 1);
    }
    popToTop() {
        this.popToRoute(this.state.routeStack[0]);
    }
    popToRoute(route) {
        const indexOfRoute = this.state.routeStack.indexOf(route);
        this._invariant(indexOfRoute !== -1, 'Calling popToRoute for a route that doesn\'t exist!');
        const numToPop = this.state.presentedIndex - indexOfRoute;
        this._popN(numToPop);
    }
    replacePreviousAndPop(route) {
        if (this.state.routeStack.length < 2) {
            return;
        }
        this.replacePrevious(route);
        this.pop();
    }
    getCurrentRoutes() {
        // Clone before returning to avoid caller mutating the stack.
        return this.state.routeStack.slice();
    }
    _updateDimensionsCache() {
        const transitioner = ReactDOM.findDOMNode(this.refs['transitioner']);
        this._dimensions = {
            width: transitioner.offsetWidth,
            height: transitioner.offsetHeight
        };
    }
    // Helper method to extract Navigator's Scene config from the route
    _getSceneConfigFromRoute(route) {
        // route exists? query the factory to generate a scene configuration
        if (route) {
            return NavigatorSceneConfigFactory_1.NavigatorSceneConfigFactory.createConfig(route.sceneConfigType);
        }
        return undefined;
    }
    // Render a scene for the navigator
    _renderNavigatorScene(route, index) {
        let styles = [_styles.baseScene, _styles.sceneStyle,
            _styles.defaultSceneStyle];
        if (index !== this.state.presentedIndex) {
            // update styles
            styles.push(_styles.disabledScene);
        }
        // Wraps the callback passed as a prop to Navigator to render the scene
        return (React.createElement(View_1.default, { key: 'scene_' + this._getRouteID(route), ref: 'scene_' + index, style: styles }, this.props.renderScene(route)));
    }
    // Push a scene below the others so they don't block touches sent to the presented scenes.
    _disableScene(sceneIndex) {
        if (this.refs['scene_' + sceneIndex]) {
            this._setNativeStyles(this.refs['scene_' + sceneIndex], {
                opacity: 0,
                zIndex: -10
            });
        }
    }
    // Add styles on the scene - At this time, the scene should be mounted and sitting in the
    // DOM. We are just adding giving styles to this current scene.
    _enableScene(sceneIndex) {
        let sceneStyle = Styles_1.default.combine(undefined, [_styles.baseScene, _styles.sceneStyle, _styles.defaultSceneStyle]);
        // Then restore the top value for this scene.
        const enabledSceneNativeProps = {
            style: {
                top: sceneStyle['top'],
                bottom: sceneStyle['bottom'],
                zIndex: 0
            }
        };
        if (sceneIndex !== this.state.transitionFromIndex &&
            sceneIndex !== this.state.presentedIndex) {
            // If we are not in a transition from this index, make sure opacity is 0 to prevent the enabled scene from
            // flashing over the presented scene.
            enabledSceneNativeProps.style.opacity = 0;
        }
        if (this.refs['scene_' + sceneIndex]) {
            this._setNativeStyles(this.refs['scene_' + sceneIndex], enabledSceneNativeProps.style);
        }
    }
    _transitionTo(destIndex, velocity, jumpSpringTo, cb) {
        // If we're already presenting this index, bail here.
        if (destIndex === this.state.presentedIndex) {
            return;
        }
        // If we're already transitioning to another index, queue this one.
        if (this.state.transitionFromIndex !== undefined) {
            let newTransitionQueue = _.cloneDeep(this.state.transitionQueue);
            newTransitionQueue.push({
                destIndex: destIndex,
                velocity: velocity,
                transitionFinished: cb
            });
            // set new transition queue
            this.setState({ transitionQueue: newTransitionQueue });
            return;
        }
        // Set new state values.
        this.state.transitionFromIndex = this.state.presentedIndex;
        this.state.presentedIndex = destIndex;
        this.state.transitionFinished = cb;
        // Grab the scene config from the route we're leaving.
        const sceneConfig = this.state.sceneConfigStack[this.state.transitionFromIndex] ||
            this.state.sceneConfigStack[this.state.presentedIndex];
        this._invariant(!!sceneConfig, 'Cannot configure scene at index ' + this.state.transitionFromIndex);
        // Set the spring in motion. Updates will trigger _handleSpringUpdate.
        if (jumpSpringTo !== undefined) {
            this.spring.setCurrentValue(jumpSpringTo);
        }
        this.spring.setOvershootClampingEnabled(true);
        this.spring.getSpringConfig().friction = sceneConfig.springFriction;
        this.spring.getSpringConfig().tension = sceneConfig.springTension;
        this.spring.setVelocity(velocity || sceneConfig.defaultTransitionVelocity);
        this.spring.setEndValue(1);
        if (this.props.transitionStarted) {
            this.props.transitionStarted();
        }
    }
    _completeTransition() {
        let newState = {};
        this.state.transitionFromIndex = undefined;
        this.spring.setCurrentValue(0).setAtRest();
        this._hideScenes();
        // Do we have pending transitions? trigger transitions then
        if (this.state.transitionQueue.length) {
            let newTransitionQueue = _.cloneDeep(this.state.transitionQueue);
            const queuedTransition = newTransitionQueue.shift();
            // add styles on the scene we are about to transition to
            this._enableScene(queuedTransition.destIndex);
            this._transitionTo(queuedTransition.destIndex, queuedTransition.velocity, undefined, queuedTransition.transitionFinished);
            if (this.state.transitionFinished) {
                this.state.transitionFinished();
                newState.transitionFinished = undefined;
            }
            newState.transitionQueue = newTransitionQueue;
            // New setState
            this.setState(newState);
        }
        else if (this.props.transitionCompleted) {
            this.props.transitionCompleted();
        }
    }
    _hideScenes() {
        for (let i = 0; i < this.state.routeStack.length; i++) {
            if (i === this.state.presentedIndex ||
                i === this.state.transitionFromIndex) {
                continue;
            }
            this._disableScene(i);
        }
    }
    // This happens for each frame of either a gesture or a transition. If both are happening, we only set values for
    // the transition and the gesture will catch up later.
    _handleSpringUpdate() {
        // Prioritize handling transition in progress over a gesture:
        if (this.state.transitionFromIndex !== undefined) {
            this._transitionBetween(this.state.transitionFromIndex, this.state.presentedIndex, this.spring.getCurrentValue());
        }
    }
    _transitionSceneStyle(fromIndex, toIndex, progress, index) {
        const viewAtIndex = this.refs['scene_' + index];
        if (viewAtIndex === undefined) {
            return;
        }
        // Use toIndex animation when we move forwards. Use fromIndex when we move back.
        const sceneConfigIndex = fromIndex < toIndex ? toIndex : fromIndex;
        let sceneConfig = this.state.sceneConfigStack[sceneConfigIndex];
        // This happens for overswiping when there is no scene at toIndex.
        if (!sceneConfig) {
            sceneConfig = this.state.sceneConfigStack[sceneConfigIndex - 1];
        }
        let styleToUse = {};
        const useFn = index < fromIndex || index < toIndex ?
            sceneConfig.animationInterpolators.out :
            sceneConfig.animationInterpolators.into;
        const directionAdjustedProgress = fromIndex < toIndex ? progress : 1 - progress;
        const didChange = useFn(styleToUse, this._dimensions, directionAdjustedProgress);
        if (didChange) {
            this._setNativeStyles(viewAtIndex, styleToUse);
        }
    }
    _transitionBetween(fromIndex, toIndex, progress) {
        this._transitionSceneStyle(fromIndex, toIndex, progress, fromIndex);
        this._transitionSceneStyle(fromIndex, toIndex, progress, toIndex);
    }
    _getDestIndexWithinBounds(n) {
        const currentIndex = this.state.presentedIndex;
        const destIndex = currentIndex + n;
        this._invariant(destIndex >= 0, 'Cannot jump before the first route.');
        const maxIndex = this.state.routeStack.length - 1;
        this._invariant(maxIndex >= destIndex, 'Cannot jump past the last route.');
        return destIndex;
    }
    _jumpN(n) {
        const destIndex = this._getDestIndexWithinBounds(n);
        this._invariant(destIndex !== -1, 'Cannot jump to route that is not in the route stack');
        this._enableScene(destIndex);
        this._transitionTo(destIndex);
    }
    _popN(n) {
        if (n === 0) {
            return;
        }
        this._invariant(this.state.presentedIndex - n >= 0, 'Cannot pop below zero');
        const popIndex = this.state.presentedIndex - n;
        this._enableScene(popIndex);
        this._transitionTo(popIndex, undefined, // default velocity
        undefined, // no spring jumping
        () => {
            this._cleanScenesPastIndex(popIndex);
        });
    }
    _cleanScenesPastIndex(index) {
        const newStackLength = index + 1;
        // Remove any unneeded rendered routes.
        if (newStackLength < this.state.routeStack.length) {
            this.setState({
                sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
                routeStack: this.state.routeStack.slice(0, newStackLength)
            });
        }
    }
    // Get routeId for the incoming route
    _getRouteID(route) {
        return route.routeId;
    }
    // Define an inconstiant method like React.Navigator
    _invariant(test, failureMessage) {
        if (!test) {
            throw failureMessage;
        }
    }
    // Manually override the styles in the DOM for the given component. This method is a hacky equivalent of React Native's
    // setNativeProps.
    _setNativeStyles(component, currentStyles) {
        // Grab the actual element from the DOM.
        let element = ReactDOM.findDOMNode(component);
        const flatStyles = _.isArray(currentStyles) ? _.flatten(currentStyles) : currentStyles;
        // Modify styles
        _.assign(element.style, flatStyles);
    }
}
exports.Navigator = Navigator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navigator;
