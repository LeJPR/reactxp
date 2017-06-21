/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform View abstraction.
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
const _ = require("./lodashMini");
const React = require("react");
const RN = require("react-native");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const AnimateListEdits_1 = require("./listAnimations/AnimateListEdits");
const Button_1 = require("./Button");
const ViewBase_1 = require("./ViewBase");
class View extends ViewBase_1.default {
    constructor(props) {
        super(props);
        this._internalProps = {};
        this._buildInternalProps(props);
    }
    componentWillReceiveProps(nextProps) {
        this._buildInternalProps(nextProps);
    }
    /**
     * Attention:
     * be careful with setting any non layout properties unconditionally in this method to any value
     * as on android that would lead to extra layers of Views.
     */
    _buildInternalProps(props) {
        this._internalProps = _.clone(props);
        this._internalProps.style = this._getStyles(props);
        this._internalProps.ref = this._setNativeView;
        const importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(props.importantForAccessibility);
        const accessibilityLabel = props.accessibilityLabel || props.title;
        // Set accessibility props on Native only if we have valid importantForAccessibility value or accessibility label or
        // if this view is not a button.
        // For a button, we let the Button component compute its own accessibility props.
        const shouldSetAccessibilityProps = this._internalProps && !this._isButton(props) &&
            !!(importantForAccessibility || accessibilityLabel);
        if (shouldSetAccessibilityProps) {
            this._internalProps.importantForAccessibility = importantForAccessibility;
            this._internalProps.accessibilityLabel = accessibilityLabel;
            this._internalProps.accessibilityTraits = AccessibilityUtil_1.default.accessibilityTraitToString(props.accessibilityTraits);
            this._internalProps.accessibilityComponentType = AccessibilityUtil_1.default.accessibilityComponentTypeToString(props.accessibilityTraits);
        }
        if (props.onLayout) {
            this._internalProps.onLayout = this._onLayout;
        }
        if (props.blockPointerEvents) {
            this._internalProps.pointerEvents = 'none';
        }
        else {
            if (props.ignorePointerEvents) {
                this._internalProps.pointerEvents = 'box-none';
            }
        }
    }
    _isButton(viewProps) {
        return !!(viewProps.onPress || viewProps.onLongPress);
    }
    render() {
        if (this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave) {
            return (React.createElement(AnimateListEdits_1.default, __assign({}, this._internalProps), this.props.children));
        }
        else if (this._isButton(this.props)) {
            return (React.createElement(Button_1.default, __assign({}, this._internalProps), this.props.children));
        }
        else {
            return (React.createElement(RN.View, __assign({}, this._internalProps), this.props.children));
        }
    }
    focus() {
        AccessibilityUtil_1.default.setAccessibilityFocus(this);
    }
}
exports.View = View;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = View;
