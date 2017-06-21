/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Text component.
*/
"use strict";
const React = require("react");
const RN = require("react-native");
const AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
const Text_1 = require("../native-common/Text");
const Styles_1 = require("../native-common/Styles");
var _styles = {
    defaultText: Styles_1.default.createTextStyle({
        includeFontPadding: false,
        textAlignVertical: 'center'
    })
};
class Text extends Text_1.Text {
    _getStyles() {
        return Styles_1.default.combine(_styles.defaultText, this.props.style);
    }
    // We override the render method to work around a couple of Android-specific
    // bugs in RN. First, numberOfLines needs to be set to null rather than 0 to
    // indicate an unbounded number of lines. Second, ellipsizeMode needs to be set
    // to null to indicate the default behavior.
    render() {
        const importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (React.createElement(RN.Text, { style: this._getStyles(), ref: 'nativeText', importantForAccessibility: importantForAccessibility, numberOfLines: this.props.numberOfLines === 0 ? null : this.props.numberOfLines, allowFontScaling: this.props.allowFontScaling, maxContentSizeMultiplier: this.props.maxContentSizeMultiplier, ellipsizeMode: this.props.ellipsizeMode, onPress: this.props.onPress, textBreakStrategy: this.props.textBreakStrategy }, this.props.children));
    }
}
exports.Text = Text;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Text;
