/**
* MonitorListEdits.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Looks for insertions, removals, and moves each time the component receives new
* children. Communicates these list edits to the consumer giving it the opportunity
* to animate the edits.
*/
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const _ = require("./../utils/lodashMini");
const assert = require("assert");
const React = require("react");
const ReactDOM = require("react-dom");
function getPosition(el) {
    return {
        left: el.offsetLeft,
        top: el.offsetTop
    };
}
function extractChildrenKeys(children) {
    var keys = [];
    React.Children.forEach(children, function (child, index) {
        if (child) {
            let childReactElement = child;
            assert(childReactElement.key !== undefined && childReactElement.key !== null, 'Children passed to a `View` with child animations enabled must have a `key`');
            keys.push(childReactElement.key);
        }
    });
    return keys;
}
// Returns true if the children were edited (e.g. an item was added, moved, or removed).
// We use this information to determine whether or not we'll need to play any list edit
// animations.
function childrenEdited(prevChildrenKeys, nextChildrenKeys) {
    return !_.isEqual(prevChildrenKeys, nextChildrenKeys);
}
function createChildrenMap(children) {
    var map = {};
    React.Children.forEach(children, function (child, index) {
        if (child) {
            let childReactElement = child;
            assert('key' in childReactElement, 'Children passed to a `View` with child animations enabled must have a `key`');
            map[childReactElement['key']] = childReactElement;
        }
    });
    return map;
}
function computePositions(refs) {
    var positions = {};
    _.each(refs, (ref, key) => {
        positions[key] = getPosition(ref.domElement);
    });
    return positions;
}
// The states the React component can be in.
var ComponentPhaseEnum;
(function (ComponentPhaseEnum) {
    // The rest state. The component is not in the middle of anything.
    ComponentPhaseEnum[ComponentPhaseEnum["rest"] = 0] = "rest";
    // The component is about to play an animation. This occurs when the component
    // detected a list edit in componentWillUpdate but hasn't yet gotten the opportunity
    // to start the animation in componentDidUpdate.
    ComponentPhaseEnum[ComponentPhaseEnum["willAnimate"] = 1] = "willAnimate";
    // The component is in the middle of playing an animation. The component should not
    // rerender while in this state.
    ComponentPhaseEnum[ComponentPhaseEnum["animating"] = 2] = "animating";
})(ComponentPhaseEnum || (ComponentPhaseEnum = {}));
class MonitorListEdits extends React.Component {
    constructor() {
        super(...arguments);
        this._itemRefs = {}; // Updated after render but before componentDidUpdate
        this._refReplacementCache = {};
        this._isMounted = false;
        this._phase = ComponentPhaseEnum.rest;
        this._willAnimatePhaseInfo = null;
    }
    componentWillMount() {
        this._childrenKeys = extractChildrenKeys(this.props.children);
        this._childrenMap = createChildrenMap(this.props.children);
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    shouldComponentUpdate() {
        return this._phase !== ComponentPhaseEnum.animating;
    }
    componentWillUpdate(nextProps) {
        assert(this._phase !== ComponentPhaseEnum.animating, 'componentWillUpdate should never run while the component is animating due to the implementation of shouldComponentUpdate');
        let prevChildrenKeys = this._childrenKeys;
        let nextChildrenKeys = extractChildrenKeys(nextProps.children);
        this._childrenKeys = nextChildrenKeys;
        if (childrenEdited(prevChildrenKeys, nextChildrenKeys)) {
            let prevChildrenMap = this._childrenMap;
            let nextChildrenMap = createChildrenMap(nextProps.children);
            this._childrenMap = nextChildrenMap;
            let removed = [];
            let added = [];
            let other = [];
            Object.keys(prevChildrenMap).forEach(function (key) {
                if (!(key in nextChildrenMap)) {
                    removed.push(prevChildrenMap[key]);
                }
            });
            Object.keys(nextChildrenMap).forEach(function (key) {
                if (!(key in prevChildrenMap)) {
                    added.push(nextChildrenMap[key]);
                }
                else {
                    other.push(nextChildrenMap[key]);
                }
            });
            this._phase = ComponentPhaseEnum.willAnimate;
            this._willAnimatePhaseInfo = {
                added: added,
                removed: removed,
                other: other,
                prevPositions: computePositions(this._itemRefs),
                prevChildrenMap: prevChildrenMap
            };
        }
    }
    render() {
        this._childrenToRender = [];
        _.each(this.props.children, child => {
            if (child) {
                let childElement = child;
                let refData = this._refReplacementCache[childElement.key];
                // Reuse the cached replacement ref function instead of recreating it every render, unless the child's ref changes.
                if (!refData || refData.exisiting !== childElement.ref) {
                    refData = {
                        replacement: refValue => { this._saveRef(childElement, refValue); },
                        exisiting: childElement.ref
                    };
                    this._refReplacementCache[childElement.key] = refData;
                }
                this._childrenToRender.push(React.cloneElement(childElement, { ref: refData.replacement }));
            }
        });
        if (this._phase === ComponentPhaseEnum.willAnimate) {
            _.each(this._willAnimatePhaseInfo.removed, childElement => {
                if (childElement) {
                    this._childrenToRender.push(React.cloneElement(childElement, {
                        ref: (refValue) => {
                            this._saveRef(childElement, refValue);
                        }
                    }));
                }
            });
        }
        return (React.createElement("div", __assign({}, this.props), this._childrenToRender));
    }
    componentDidUpdate(prevProps) {
        assert(this._phase !== ComponentPhaseEnum.animating, 'componentDidUpdate should never run while the component is animating due to the implementation of shouldComponentUpdate');
        if (this._phase === ComponentPhaseEnum.willAnimate) {
            let phaseInfo = this._willAnimatePhaseInfo;
            let prevPositions = phaseInfo.prevPositions;
            let nextPositions = computePositions(this._itemRefs);
            let added = phaseInfo.added.map(child => {
                return {
                    element: this._itemRefs[child.key].reactElement
                };
            });
            let removed = phaseInfo.removed.map(child => {
                let key = child.key;
                let prevPos = prevPositions[key];
                let nextPos = nextPositions[key];
                return {
                    leftDelta: nextPos.left - prevPos.left,
                    topDelta: nextPos.top - prevPos.top,
                    element: this._itemRefs[key].reactElement
                };
            });
            let moved = [];
            phaseInfo.other.map(child => {
                let key = child.key;
                let prevPos = prevPositions[key];
                let nextPos = nextPositions[key];
                if (prevPos.left !== nextPos.left || prevPos.top !== nextPos.top) {
                    moved.push({
                        leftDelta: nextPos.left - prevPos.left,
                        topDelta: nextPos.top - prevPos.top,
                        element: this._itemRefs[key].reactElement
                    });
                }
            });
            this._phase = ComponentPhaseEnum.animating;
            this._willAnimatePhaseInfo = null;
            this.props.componentWillAnimate({
                added: added,
                moved: moved,
                removed: removed
            }, () => {
                this._phase = ComponentPhaseEnum.rest;
                if (this._isMounted) {
                    this.forceUpdate();
                }
                phaseInfo.removed.forEach(child => {
                    delete this._refReplacementCache[child.key];
                });
            });
        }
    }
    _saveRef(reactElement, refValue) {
        if (refValue === null) {
            delete this._itemRefs[reactElement.key];
        }
        else {
            // Cache both the react component reference and the corresponding HTML DOM node (for perf reasons).
            this._itemRefs[reactElement.key] = {
                reactElement: refValue,
                domElement: ReactDOM.findDOMNode(refValue)
            };
        }
        assert(typeof reactElement.ref === 'function' || reactElement.ref === undefined || reactElement.ref === null, 'Invalid ref: ' + reactElement.ref + '. Only callback refs are supported when using child animations on a `View`');
        // If the creator of the reactElement also provided a ref, call it.
        if (typeof reactElement.ref === 'function') {
            reactElement.ref(refValue);
        }
    }
}
exports.MonitorListEdits = MonitorListEdits;
