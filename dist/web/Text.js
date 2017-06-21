/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Text abstraction.
*/
"use strict";
const React = require("react");
const ReactDOM = require("react-dom");
const PropTypes = require("prop-types");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
// Adding a CSS rule to display non-selectable texts. Those texts
// will be displayed as pseudo elements to prevent them from being copied
// to clipboard. It's not possible to style pseudo elements with inline
// styles, so, we're dynamically creating a <style> tag with the rule.
if (typeof document !== 'undefined') {
    const textAsPseudoElement = '[data-text-as-pseudo-element]::before { content: attr(data-text-as-pseudo-element); }';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(textAsPseudoElement));
    document.head.appendChild(style);
}
const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flex: '0 0 auto',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flex: '0 0 auto',
        overflow: 'hidden',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};
class Text extends RX.Text {
    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is an Types.Text.
        // Because they're in an Types.Text, they should style themselves specially for appearing
        // inline with text.
        return { isRxParentAText: true };
    }
    render() {
        // Handle special case
        if (typeof this.props.children === 'string' && this.props.children === '\n') {
            return React.createElement("br", null);
        }
        const isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        if (this.props.selectable || typeof this.props.children !== 'string') {
            return (React.createElement("div", { style: this._getStyles(), "aria-hidden": isAriaHidden, onClick: this.props.onPress }, this.props.children));
        }
        else {
            // user-select CSS property doesn't prevent the text from being copied to clipboard.
            // To avoid getting to clipboard, the text from data-text-as-pseudo-element attribute
            // will be displayed as pseudo element.
            return (React.createElement("div", { style: this._getStyles(), "aria-hidden": isAriaHidden, onClick: this.props.onPress, "data-text-as-pseudo-element": this.props.children }));
        }
    }
    _getStyles() {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        let combinedStyles = Styles_1.default.combine(this.props.numberOfLines === 1 ?
            _styles.ellipsis : _styles.defaultStyle, this.props.style);
        // Handle cursor styles
        if (this.props.selectable) {
            combinedStyles['cursor'] = 'text';
            combinedStyles['userSelect'] = 'text';
            combinedStyles['WebkitUserSelect'] = 'text';
            combinedStyles['MozUserSelect'] = 'text';
            combinedStyles['msUserSelect'] = 'text';
        }
        else {
            combinedStyles['cursor'] = 'inherit';
        }
        if (this.props.onPress) {
            combinedStyles['cursor'] = 'pointer';
        }
        return combinedStyles;
    }
    blur() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    }
    focus() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    }
}
Text.childContextTypes = {
    isRxParentAText: PropTypes.bool.isRequired
};
exports.Text = Text;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Text;
