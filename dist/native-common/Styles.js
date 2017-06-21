/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of style functions.
*/
"use strict";
const _ = require("./lodashMini");
const RN = require("react-native");
const RX = require("../common/Interfaces");
const StyleLeakDetector_1 = require("./StyleLeakDetector");
const forbiddenProps = [
    'wordBreak',
    'appRegion',
    'cursor'
];
class Styles extends RX.Styles {
    combine(defaultStyle, ruleSet, overrideStyle) {
        let styles = [defaultStyle];
        if (ruleSet) {
            if (ruleSet instanceof Array) {
                styles = styles.concat(ruleSet);
            }
            else {
                styles.push(ruleSet);
            }
        }
        if (overrideStyle) {
            styles.push(overrideStyle);
        }
        return styles;
    }
    // Creates opaque styles that can be used for View
    createViewStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates animated styles that can be used for View
    createAnimatedViewStyle(ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    }
    // Creates opaque styles that can be used for ScrollView
    createScrollViewStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for Button
    createButtonStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for WebView
    createWebViewStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for Text
    createTextStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for Text
    createAnimatedTextStyle(ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    }
    // Creates opaque styles that can be used for TextInput
    createTextInputStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for TextInput
    createAnimatedTextInputStyle(ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    }
    // Creates opaque styles that can be used for Image
    createImageStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates animated opaque styles that can be used for Image
    createAnimatedImageStyle(ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    }
    // Creates opaque styles that can be used for Link
    createLinkStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for Picker
    createPickerStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    _adaptStyles(def, cacheStyle) {
        let adaptedRuleSet = def;
        if (cacheStyle) {
            StyleLeakDetector_1.default.detectLeaks(def);
            // Forbidden props are not allowed in uncached styles. Perform the
            // omit only in the cached path.
            adaptedRuleSet = _.omit(adaptedRuleSet, forbiddenProps);
        }
        // Convert text styling
        let textStyle = adaptedRuleSet;
        if (textStyle.font) {
            if (textStyle.font.fontFamily !== undefined) {
                textStyle.fontFamily = textStyle.font.fontFamily;
            }
            if (textStyle.font.fontWeight !== undefined) {
                textStyle.fontWeight = textStyle.font.fontWeight;
            }
            if (textStyle.font.fontStyle !== undefined) {
                textStyle.fontStyle = textStyle.font.fontStyle;
            }
            delete textStyle.font;
        }
        if (def.flex !== undefined) {
            var flexValue = def.flex;
            delete adaptedRuleSet.flex;
            if (flexValue > 0) {
                // n 1 auto
                adaptedRuleSet.flexGrow = flexValue;
                adaptedRuleSet.flexShrink = 1;
            }
            else if (flexValue < 0) {
                // 0 1 auto
                adaptedRuleSet.flexGrow = 0;
                adaptedRuleSet.flexShrink = 1;
            }
            else {
                // 0 0 auto
                adaptedRuleSet.flexGrow = 0;
                adaptedRuleSet.flexShrink = 0;
            }
        }
        if (cacheStyle) {
            return RN.StyleSheet.create({ _style: adaptedRuleSet })._style;
        }
        return adaptedRuleSet;
    }
    _adaptAnimatedStyles(def) {
        return _.omit(def, forbiddenProps);
    }
}
exports.Styles = Styles;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Styles();
