/**
* ViewBase.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Base class that is used for several RX views.
*/
"use strict";
const _ = require("./lodashMini");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
class ViewBase extends RX.ViewBase {
    constructor() {
        super(...arguments);
        this._layoutEventValues = null;
        this._nativeView = null;
        this._setNativeView = (view) => {
            this._nativeView = view;
        };
        this._onLayout = (event) => {
            if (this.props.onLayout) {
                const layoutEventValues = {
                    x: event.nativeEvent.layout.x,
                    y: event.nativeEvent.layout.y,
                    width: event.nativeEvent.layout.width,
                    height: event.nativeEvent.layout.height
                };
                // Only fire the onLayout callback if the layout values change
                if (!_.isEqual(this._layoutEventValues, layoutEventValues)) {
                    this.props.onLayout(layoutEventValues);
                    this._layoutEventValues = layoutEventValues;
                }
            }
        };
    }
    static setDefaultViewStyle(defaultViewStyle) {
        ViewBase._defaultViewStyle = defaultViewStyle;
    }
    // To be able to use View inside TouchableHighlight/TouchableOpacity
    setNativeProps(nativeProps) {
        if (this._nativeView) {
            this._nativeView.setNativeProps(nativeProps);
        }
    }
    _getStyles(props) {
        // If this platform uses an explicit default view style, push it on to
        // the front of the list of provided styles.
        if (ViewBase._defaultViewStyle) {
            return Styles_1.default.combine(ViewBase._defaultViewStyle, props.style);
        }
        return props.style;
    }
    focus() {
        // native mobile platforms doesn't have the notion of focus for Views, so ignore.
    }
    blur() {
        // native mobile platforms doesn't have the notion of blur for Views, so ignore.
    }
}
ViewBase._defaultViewStyle = null;
exports.ViewBase = ViewBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewBase;
