/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Button abstraction.
*/
"use strict";
const assert = require("assert");
const React = require("react");
const RN = require("react-native");
const Animated_1 = require("./Animated");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const Types = require("../common/Types");
const _styles = {
    defaultButton: Styles_1.default.createButtonStyle({
        alignItems: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    }),
    disabled: Styles_1.default.createButtonStyle({
        opacity: 0.5
    })
};
const _defaultAccessibilityTrait = Types.AccessibilityTrait.Button;
const _defaultImportantForAccessibility = Types.ImportantForAccessibility.Yes;
const _defaultActiveOpacity = 0.2;
const _inactiveOpacityAnimationDuration = 250;
const _activeOpacityAnimationDuration = 0;
const _hideUnderlayTimeout = 100;
const _underlayInactive = 'transparent';
function noop() { }
function applyMixin(thisObj, mixin, propertiesToSkip) {
    Object.getOwnPropertyNames(mixin).forEach(name => {
        if (name !== 'constructor' && propertiesToSkip.indexOf(name) === -1) {
            assert(!(name in thisObj), `An object cannot have a method with the same name as one of its mixins: "${name}"`);
            thisObj[name] = mixin[name].bind(thisObj);
        }
    });
}
class Button extends RX.Button {
    constructor(props) {
        super(props);
        this._mixin_componentDidMount = RN.Touchable.Mixin.componentDidMount || noop;
        this._mixin_componentWillUnmount = RN.Touchable.Mixin.componentWillUnmount || noop;
        this._isMounted = false;
        this._hideTimeout = null;
        this._buttonElement = null;
        this._defaultOpacityValue = null;
        this._opacityAnimatedValue = null;
        this._opacityAnimatedStyle = null;
        this.touchableHandleActivePressIn = (e) => {
            if (this._isTouchFeedbackApplicable()) {
                if (this.props.underlayColor) {
                    clearTimeout(this._hideTimeout);
                    this._hideTimeout = undefined;
                    this._showUnderlay();
                }
                // We do not want to animate opacity if underlayColour is provided. Unless an explicit activeOpacity is provided
                if (!this.props.disableTouchOpacityAnimation && (this.props.activeOpacity || !this.props.underlayColor)) {
                    this._opacityActive(_activeOpacityAnimationDuration);
                }
            }
            if (!this.props.disabled && this.props.onPressIn) {
                this.props.onPressIn(e);
            }
        };
        this.touchableHandleActivePressOut = (e) => {
            if (this._isTouchFeedbackApplicable()) {
                if (this.props.underlayColor) {
                    clearTimeout(this._hideTimeout);
                    this._hideTimeout = setTimeout(this._hideUnderlay, _hideUnderlayTimeout);
                }
                if (!this.props.disableTouchOpacityAnimation && (this.props.activeOpacity || !this.props.underlayColor)) {
                    this._opacityInactive(_inactiveOpacityAnimationDuration);
                }
            }
            if (!this.props.disabled && this.props.onPressOut) {
                this.props.onPressOut(e);
            }
        };
        this.touchableHandlePress = (e) => {
            if (!this.props.disabled && this.props.onPress) {
                this.props.onPress(e);
            }
        };
        this.touchableHandleLongPress = (e) => {
            if (!this.props.disabled && this.props.onLongPress) {
                this.props.onLongPress(e);
            }
        };
        this.touchableGetHighlightDelayMS = () => {
            return 20;
        };
        this.touchableGetPressRectOffset = () => {
            return { top: 20, left: 20, right: 20, bottom: 100 };
        };
        this._onButtonRef = (btn) => {
            this._buttonElement = btn;
        };
        this._hideUnderlay = () => {
            if (!this._isMounted || !this._buttonElement) {
                return;
            }
            this._buttonElement.setNativeProps({
                style: [{
                        backgroundColor: _underlayInactive
                    }, this.props.style],
            });
        };
        applyMixin(this, RN.Touchable.Mixin, [
            // Properties that Button and RN.Touchable.Mixin have in common. Button needs
            // to dispatch these methods to RN.Touchable.Mixin manually.
            'componentDidMount',
            'componentWillUnmount'
        ]);
        this.state = this.touchableGetInitialState();
        this._setOpacityStyles(props);
    }
    render() {
        // Accessibility props.
        const importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility, _defaultImportantForAccessibility);
        const accessibilityTrait = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits, _defaultAccessibilityTrait);
        const accessibilityComponentType = AccessibilityUtil_1.default.accessibilityComponentTypeToString(this.props.accessibilityTraits, _defaultAccessibilityTrait);
        const opacityStyle = !this.props.disableTouchOpacityAnimation && this._opacityAnimatedStyle;
        return (React.createElement(RN.Animated.View, { ref: this._onButtonRef, style: Styles_1.default.combine(_styles.defaultButton, [this.props.style, opacityStyle], this.props.disabled && _styles.disabled), accessibilityLabel: this.props.accessibilityLabel || this.props.title, accessibilityTraits: accessibilityTrait, accessibilityComponentType: accessibilityComponentType, importantForAccessibility: importantForAccessibility, onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder, onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest, onResponderGrant: this.touchableHandleResponderGrant, onResponderMove: this.touchableHandleResponderMove, onResponderRelease: this.touchableHandleResponderRelease, onResponderTerminate: this.touchableHandleResponderTerminate, shouldRasterizeIOS: this.props.shouldRasterizeIOS }, this.props.children));
    }
    componentDidMount() {
        this._mixin_componentDidMount();
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._mixin_componentWillUnmount();
        this._isMounted = false;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            // If opacity got updated as a part of props update, we need to reflect that in the opacity animation value
            this._setOpacityStyles(nextProps);
        }
    }
    setNativeProps(nativeProps) {
        if (this._buttonElement) {
            this._buttonElement.setNativeProps(nativeProps);
        }
    }
    focus() {
        AccessibilityUtil_1.default.setAccessibilityFocus(this);
    }
    blur() {
        // native mobile platforms doesn't have the notion of blur for buttons, so ignore.
    }
    _setOpacityStyles(props) {
        const currentOpacityValue = this._getDefaultOpacityValue(props);
        if (this._defaultOpacityValue !== currentOpacityValue) {
            this._defaultOpacityValue = currentOpacityValue;
            this._opacityAnimatedValue = new Animated_1.default.Value(this._defaultOpacityValue);
            this._opacityAnimatedStyle = Styles_1.default.createAnimatedViewStyle({
                opacity: this._opacityAnimatedValue
            });
        }
    }
    _isTouchFeedbackApplicable() {
        return this._isMounted && this._hasPressHandler() && this._buttonElement;
    }
    _opacityActive(duration) {
        this.setOpacityTo(this.props.activeOpacity || _defaultActiveOpacity, duration);
    }
    _opacityInactive(duration) {
        this.setOpacityTo(this._defaultOpacityValue, duration);
    }
    _getDefaultOpacityValue(props) {
        let flattenedStyles = null;
        if (props && props.style) {
            flattenedStyles = RN.StyleSheet.flatten(props.style);
        }
        return flattenedStyles && flattenedStyles.opacity || 1;
    }
    /**
    * Animate the touchable to a new opacity.
    */
    setOpacityTo(value, duration) {
        Animated_1.default.timing(this._opacityAnimatedValue, {
            toValue: value,
            duration: duration,
            easing: Animated_1.default.Easing.InOut()
        }).start();
    }
    _hasPressHandler() {
        return !!(this.props.onPress ||
            this.props.onPressIn ||
            this.props.onPressOut ||
            this.props.onLongPress);
    }
    _showUnderlay() {
        if (!this._buttonElement) {
            return;
        }
        this._buttonElement.setNativeProps({
            style: {
                backgroundColor: this.props.underlayColor
            }
        });
    }
}
exports.Button = Button;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Button;
