/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Button abstraction.
*/
"use strict";
const _ = require("./utils/lodashMini");
const React = require("react");
const ReactDOM = require("react-dom");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const Types = require("../common/Types");
const FocusManager_1 = require("./utils/FocusManager");
let _styles = {
    defaultButton: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center',
        appRegion: 'no-drag',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textAlign: 'left',
        borderWidth: '0'
    },
    disabled: {
        opacity: 0.5
    }
};
const _longPressTime = 1000;
const _defaultAccessibilityTrait = Types.AccessibilityTrait.Button;
class Button extends RX.Button {
    constructor() {
        super(...arguments);
        this._lastMouseDownTime = 0;
        this._ignoreClick = false;
        this._focusDueToMouseEvent = false;
        this._blurDueToMouseEvent = false;
        this.onClick = (e) => {
            if (this._ignoreClick) {
                e.stopPropagation();
                this._ignoreClick = false;
            }
            else if (!this.props.disabled && this.props.onPress) {
                this.props.onPress(e);
            }
        };
        this._onContextMenu = (e) => {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(e);
            }
        };
        this._onMouseDown = (e) => {
            if (this.props.onPressIn) {
                this.props.onPressIn(e);
            }
            if (this.props.onLongPress) {
                this._lastMouseDownTime = Date.now().valueOf();
                this._lastMouseDownEvent = e;
                e.persist();
                this._longPressTimer = window.setTimeout(() => {
                    this._longPressTimer = undefined;
                    if (this.props.onLongPress) {
                        this.props.onLongPress(this._lastMouseDownEvent);
                        this._ignoreClick = true;
                    }
                }, _longPressTime);
            }
        };
        this._onMouseUp = (e) => {
            if (this.props.onPressOut) {
                this.props.onPressOut(e);
            }
            if (this._longPressTimer) {
                window.clearTimeout(this._longPressTimer);
            }
        };
        this._onMouseEnter = (e) => {
            if (this.props.onHoverStart) {
                this._focusDueToMouseEvent = true;
                this.props.onHoverStart(e);
            }
        };
        this._onMouseLeave = (e) => {
            if (this.props.onHoverEnd) {
                this._blurDueToMouseEvent = true;
                this.props.onHoverEnd(e);
            }
        };
        // When we get focus on an element, show the hover effect on the element.
        // This ensures that users using keyboard also get the similar experience as mouse users for accessibility.
        this._onFocus = (e) => {
            if (this.props.onHoverStart && !this._focusDueToMouseEvent) {
                this.props.onHoverStart(e);
            }
            this._focusDueToMouseEvent = false;
            if (this.props.onFocus) {
                this.props.onFocus(e);
            }
        };
        this._onBlur = (e) => {
            if (this.props.onHoverEnd && !this._blurDueToMouseEvent) {
                this.props.onHoverEnd(e);
            }
            this._blurDueToMouseEvent = false;
            if (this.props.onBlur) {
                this.props.onBlur(e);
            }
        };
    }
    render() {
        const ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits, _defaultAccessibilityTrait);
        const ariaSelected = AccessibilityUtil_1.default.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        // NOTE: We use tabIndex=0 to support focus.
        return (React.createElement("button", { style: this._getStyles(), role: ariaRole, title: this.props.title, tabIndex: this.props.tabIndex, "aria-label": this.props.accessibilityLabel || this.props.title, "aria-disabled": this.props.disabled, "aria-hidden": isAriaHidden, "aria-selected": ariaSelected, onClick: this.onClick, onContextMenu: this._onContextMenu, onMouseDown: this._onMouseDown, onMouseUp: this._onMouseUp, onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, onFocus: this._onFocus, onBlur: this._onBlur, onKeyDown: this.props.onKeyPress, disabled: this.props.disabled }, this.props.children));
    }
    focus() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    }
    blur() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    }
    _getStyles() {
        let buttonStyles = _.extend.apply(_, [{}].concat(this.props.style));
        // Specify default syle for padding only if padding is not already specified
        if (buttonStyles && buttonStyles.padding === undefined &&
            buttonStyles.paddingRight === undefined && buttonStyles.paddingLeft === undefined &&
            buttonStyles.paddingBottom === undefined && buttonStyles.paddingTop === undefined &&
            buttonStyles.paddingHorizontal === undefined && buttonStyles.paddingVertical === undefined) {
            buttonStyles['padding'] = '0';
        }
        let combinedStyles = Styles_1.default.combine(_styles.defaultButton, buttonStyles);
        if (this.props.disabled) {
            combinedStyles.opacity = 0.5;
        }
        if (this.props.disabled) {
            combinedStyles['cursor'] = 'default';
        }
        else {
            combinedStyles['cursor'] = this.props.cursor || 'pointer';
        }
        return combinedStyles;
    }
}
exports.Button = Button;
FocusManager_1.applyFocusableComponentMixin(Button);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Button;
