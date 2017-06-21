/**
* AnimateListEdits.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Each time the component receives new children, animates insertions, removals,
* and moves that occurred since the previous render. Uses React Native's
* LayoutAnimation API to achieve this.
*
* Caveats:
*   - The animations are not scoped. All layout changes in the app that occur during the
*     next bridge transaction will be animated. This is due to a limitation in React Native's
*     LayoutAnimation API.
*   - Removals are not animated. The removed item disappears instantly. Items whose positions
*     were affected by the removal are animated into their new positions. This is due to a
*     limitation in React Native's LayoutAnimation API.
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
const assert = require("assert");
const React = require("react");
const RN = require("react-native");
let LayoutAnimation = RN.LayoutAnimation;
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
function findInvalidRefs(children) {
    let invalidRefs = [];
    React.Children.forEach(children, function (child) {
        if (child) {
            let childElement = child;
            if (typeof childElement.ref !== 'function' && childElement.ref !== undefined && childElement.ref !== null) {
                invalidRefs.push(childElement.ref);
            }
        }
    });
    return invalidRefs;
}
class AnimateListEdits extends React.Component {
    // Returns true if an item was added or moved. We use this information to determine
    // whether or not we'll need to play any list edit animations.
    _childrenEdited(prevChildrenKeys, nextChildrenKeys) {
        const prevLength = prevChildrenKeys ? prevChildrenKeys.length : 0;
        const nextLength = nextChildrenKeys ? nextChildrenKeys.length : 0;
        // Were new items added?
        if (nextLength > prevLength) {
            return true;
        }
        // See if changes were limited to removals. Any additions or moves should return true.
        let prevIndex = 0;
        for (let nextIndex = 0; nextIndex < nextLength; nextIndex++) {
            if (prevChildrenKeys[prevIndex] === nextChildrenKeys[nextIndex]) {
                prevIndex++;
            }
            else {
                // If there are more "next" items left than there are "prev" items left,
                // then we know that something has been added or moved.
                if (nextLength - nextIndex > prevLength - prevIndex) {
                    return true;
                }
            }
        }
        return false;
    }
    componentWillUpdate(nextProps, nextState) {
        // The web implementation doesn't support string refs. For consistency, do the same assert
        // in the native implementation.
        assert(findInvalidRefs(this.props.children).length === 0, 'Invalid ref(s): ' + JSON.stringify(findInvalidRefs(this.props.children)) +
            ' Only callback refs are supported when using child animations on a `View`');
        let prevChildrenKeys = this._childrenKeys;
        let nextChildrenKeys = extractChildrenKeys(nextProps.children);
        this._childrenKeys = nextChildrenKeys;
        if (this._childrenEdited(prevChildrenKeys, nextChildrenKeys)) {
            let updateConfig = {
                delay: 0,
                duration: 300,
                type: LayoutAnimation.Types.easeOut
            };
            let createConfig = {
                delay: 75,
                duration: 150,
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity
            };
            var configDictionary = {
                duration: 300,
            };
            if (this.props.animateChildMove) {
                configDictionary.update = updateConfig;
            }
            if (this.props.animateChildEnter) {
                configDictionary.create = createConfig;
            }
            LayoutAnimation.configureNext(configDictionary);
        }
    }
    render() {
        return (React.createElement(RN.View, __assign({ ref: 'nativeView' }, this.props), this.props.children));
    }
    setNativeProps(nativeProps) {
        this.refs['nativeView'].setNativeProps(nativeProps);
    }
}
exports.AnimateListEdits = AnimateListEdits;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimateListEdits;
