/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of style functions.
*/
"use strict";
const _ = require("./utils/lodashMini");
const RX = require("../common/Interfaces");
const StyleLeakDetector_1 = require("../common/StyleLeakDetector");
class Styles extends RX.Styles {
    constructor() {
        super(...arguments);
        // Use memoize to cache the result after the first call.
        this._createDummyElement = _.memoize(() => {
            return document.createElement('testCss');
        });
        this._getCssPropertyAliasesJsStyle = _.memoize(() => {
            let props = [
                'flex',
                'flexDirection',
                'alignItems',
                'justifyContent',
                'alignSelf',
                'alignContent',
                'transform',
                'transition',
                'animationDuration',
                'animationTimingFunction',
                'animationDirection',
                'animationDelay',
                'animationIterationCount',
                'animationName',
                'hyphens',
                'filter',
                'appRegion'
            ];
            let aliases = {};
            props.forEach(prop => {
                let alias = this._getCssPropertyAlias(prop);
                if (prop !== alias) {
                    aliases[prop] = alias;
                }
            });
            return aliases;
        });
        this.getCssPropertyAliasesCssStyle = memoize(() => {
            let jsStyleAliases = this._getCssPropertyAliasesJsStyle();
            let aliases = {};
            _.each(_.keys(jsStyleAliases), prop => {
                aliases[prop] = this._convertJsToCssStyle(jsStyleAliases[prop]);
            });
            return aliases;
        });
    }
    // Combines a set of styles
    combine(defaultStyle, ruleSet) {
        let combinedStyles = {};
        if (defaultStyle) {
            combinedStyles = _.extend(combinedStyles, defaultStyle);
        }
        if (ruleSet) {
            combinedStyles = _.extend.apply(_, [combinedStyles].concat(ruleSet));
        }
        if ((combinedStyles.marginLeft !== undefined || combinedStyles.marginRight !== undefined ||
            combinedStyles.marginTop !== undefined || combinedStyles.marginBottom !== undefined) &&
            combinedStyles.margin !== undefined) {
            console.error('Conflicting rules for margin specified.');
            delete combinedStyles.margin;
        }
        if ((combinedStyles.paddingLeft !== undefined || combinedStyles.paddingRight !== undefined ||
            combinedStyles.paddingTop !== undefined || combinedStyles.paddingBottom !== undefined) &&
            combinedStyles.padding !== undefined) {
            console.error('Conflicting rules for padding specified.');
            delete combinedStyles.padding;
        }
        return combinedStyles;
    }
    // Creates opaque styles that can be used for View
    createViewStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for View
    createAnimatedViewStyle(ruleSet) {
        return this._adaptStyles(ruleSet, false);
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
        return this._adaptStyles(ruleSet, false);
    }
    // Creates opaque styles that can be used for TextInput
    createTextInputStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for TextInput
    createAnimatedTextInputStyle(ruleSet) {
        return this._adaptStyles(ruleSet, false);
    }
    // Creates opaque styles that can be used for Link
    createLinkStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for Image
    createImageStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Creates opaque styles that can be used for Image
    createAnimatedImageStyle(ruleSet) {
        return this._adaptStyles(ruleSet, false);
    }
    // Creates opaque styles that can be used for Picker
    createPickerStyle(ruleSet, cacheStyle = true) {
        return this._adaptStyles(ruleSet, cacheStyle);
    }
    // Returns the name of a CSS property or its alias. Returns null if the property is not supported.
    _getCssPropertyAlias(name) {
        // If we're inside unit tests, document may not be defined yet. We don't need prefixes for tests
        if (typeof document === 'undefined') {
            return null;
        }
        let upperName = name.charAt(0).toUpperCase() + name.slice(1);
        let propsToTest = [name, upperName];
        propsToTest = propsToTest.concat(['Webkit', 'webkit', 'Moz', 'O', 'ms'].map(prefix => prefix + upperName));
        let testElement = this._createDummyElement();
        let styleObj = testElement.style;
        for (let i = 0; i < propsToTest.length; i++) {
            let prop = propsToTest[i];
            if (styleObj[prop] !== undefined) {
                return prop;
            }
        }
        return null;
    }
    // Converts a property from JavaScript style (camel-case) to CSS style (lowercase with hyphens).
    _convertJsToCssStyle(prop) {
        let cssString = '';
        if (prop) {
            for (var i = 0; i < prop.length; i++) {
                let lowerChar = prop[i].toLowerCase();
                if (lowerChar === prop[i]) {
                    cssString += lowerChar;
                }
                else {
                    cssString += '-' + lowerChar;
                }
            }
        }
        return cssString;
    }
    getParentComponentName(component) {
        let parentConstructor;
        let internalInstance = component['_reactInternalInstance'];
        if (internalInstance && internalInstance._currentElement &&
            internalInstance._currentElement._owner && internalInstance._currentElement._owner._instance) {
            parentConstructor = internalInstance._currentElement._owner._instance.constructor;
        }
        if (!parentConstructor) {
            return '';
        }
        return parentConstructor.name ? parentConstructor.name : parentConstructor;
    }
    _adaptStyles(def, validate) {
        if (validate) {
            StyleLeakDetector_1.default.detectLeaks(def);
        }
        // Expand composite types.
        if (def.font) {
            if (def.font.fontFamily !== undefined) {
                def.fontFamily = def.font.fontFamily;
            }
            if (def.font.fontWeight !== undefined) {
                def.fontWeight = def.font.fontWeight;
            }
            if (def.font.fontStyle !== undefined) {
                def.fontStyle = def.font.fontStyle;
            }
            delete def.font;
        }
        if (def.flex !== undefined) {
            let flexValue = def.flex;
            delete def.flex;
            if (flexValue > 0) {
                def.flex = flexValue.toString() + ' 1 auto';
            }
            else if (flexValue < 0) {
                def.flex = '0 1 auto';
            }
            else {
                def.flex = '0 0 auto';
            }
        }
        if (def.shadowOffset !== undefined || def.shadowRadius !== undefined || def.shadowColor !== undefined) {
            let width = 0;
            let height = 0;
            let radius = 0;
            let color = 'black';
            if (def.shadowOffset !== undefined) {
                width = def.shadowOffset.width;
                height = def.shadowOffset.height;
                delete def.shadowOffset;
            }
            if (def.shadowRadius !== undefined) {
                radius = def.shadowRadius;
                delete def.shadowRadius;
            }
            if (def.shadowColor !== undefined) {
                color = def.shadowColor;
                delete def.shadowColor;
            }
            def['boxShadow'] = width + 'px ' + height + 'px ' + radius + 'px 0px ' + color;
        }
        // CSS (and React JS) support lineHeight defined as either a multiple of the font
        // size or a pixel count. The Types interface always uses a pixel count. We need to
        // convert to the string notation to make CSS happy.
        if (def.lineHeight !== undefined) {
            def['lineHeight'] = def.lineHeight + 'px';
        }
        // Add default border width if border style was provided. Otherwise
        // the browser will default to a one-pixel border.
        if (def.borderStyle) {
            if (def.borderWidth === undefined) {
                if (def.borderTopWidth === undefined) {
                    def.borderTopWidth = 0;
                }
                if (def.borderRightWidth === undefined) {
                    def.borderRightWidth = 0;
                }
                if (def.borderBottomWidth === undefined) {
                    def.borderBottomWidth = 0;
                }
                if (def.borderLeftWidth === undefined) {
                    def.borderLeftWidth = 0;
                }
            }
        }
        // CSS doesn't support vertical/horizontal margins or padding.
        if (def.marginVertical !== undefined) {
            def.marginTop = def.marginVertical;
            def.marginBottom = def.marginVertical;
            delete def.marginVertical;
        }
        if (def.marginHorizontal !== undefined) {
            def.marginLeft = def.marginHorizontal;
            def.marginRight = def.marginHorizontal;
            delete def.marginHorizontal;
        }
        if ((def.marginHorizontal !== undefined || def.marginVertical !== undefined ||
            def.marginLeft !== undefined || def.marginRight !== undefined ||
            def.marginTop !== undefined || def.marginBottom !== undefined) && def.margin !== undefined) {
            console.error('Conflicting rules for margin specified.');
            delete def.margin;
        }
        if (def.paddingVertical !== undefined) {
            def.paddingTop = def.paddingVertical;
            def.paddingBottom = def.paddingVertical;
            delete def.paddingVertical;
        }
        if (def.paddingHorizontal !== undefined) {
            def.paddingLeft = def.paddingHorizontal;
            def.paddingRight = def.paddingHorizontal;
            delete def.paddingHorizontal;
        }
        if ((def.paddingHorizontal !== undefined || def.paddingVertical !== undefined ||
            def.paddingLeft !== undefined || def.paddingRight !== undefined ||
            def.paddingTop !== undefined || def.paddingBottom !== undefined) && def.padding !== undefined) {
            console.error('Conflicting rules for padding specified.');
            delete def.padding;
        }
        // CSS doesn't support 'textDecorationLine'
        if (def.textDecorationLine !== undefined) {
            def['textDecoration'] = def.textDecorationLine;
            delete def.textDecorationLine;
        }
        // Add common aliases if necessary.
        let jsAliases = this._getCssPropertyAliasesJsStyle();
        for (let prop in jsAliases) {
            if (def[prop] !== undefined && jsAliases[prop]) {
                def[jsAliases[prop]] = def[prop];
            }
        }
        // Add IE-specific word wrap property.
        if (def.wordBreak === 'break-word') {
            def['wordWrap'] = 'break-word';
        }
        return def;
    }
}
exports.Styles = Styles;
function memoize(func, resolver) {
    return _.memoize(func, resolver);
}
exports.memoize = memoize;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Styles();
