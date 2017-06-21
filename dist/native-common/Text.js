/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Text abstraction.
*/
"use strict";
const React = require("react");
const RN = require("react-native");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const _styles = {
    defaultText: Styles_1.default.createTextStyle({
        overflow: 'hidden'
    })
};
class Text extends RX.Text {
    // To be able to use Text inside TouchableHighlight/TouchableOpacity
    setNativeProps(nativeProps) {
        this.refs['nativeText'].setNativeProps(nativeProps);
    }
    render() {
        const importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (React.createElement(RN.Text, { style: this._getStyles(), ref: 'nativeText', importantForAccessibility: importantForAccessibility, numberOfLines: this.props.numberOfLines, allowFontScaling: this.props.allowFontScaling, maxContentSizeMultiplier: this.props.maxContentSizeMultiplier, onPress: this.props.onPress, selectable: this.props.selectable, textBreakStrategy: 'simple', ellipsizeMode: this.props.ellipsizeMode, elevation: this.props.elevation }, this.props.children));
    }
    _getStyles() {
        return Styles_1.default.combine(_styles.defaultText, this.props.style);
    }
    focus() {
        AccessibilityUtil_1.default.setAccessibilityFocus(this);
    }
    blur() {
        // No-op
    }
}
exports.Text = Text;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Text;
