/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Link abstraction.
*/
"use strict";
const React = require("react");
const RN = require("react-native");
const Linking_1 = require("../native-common/Linking");
const RX = require("../common/Interfaces");
class Link extends RX.Link {
    constructor() {
        super(...arguments);
        this._onPress = (e) => {
            if (this.props.onPress) {
                this.props.onPress(e, this.props.url);
                return;
            }
            // The default action is to launch a browser.
            if (this.props.url) {
                Linking_1.default.openUrl(this.props.url);
            }
        };
        this._onLongPress = (e) => {
            if (this.props.onLongPress) {
                this.props.onLongPress(e, this.props.url);
            }
        };
    }
    // To be able to use Link inside TouchableHighlight/TouchableOpacity
    setNativeProps(nativeProps) {
        this.refs['nativeLink'].setNativeProps(nativeProps);
    }
    render() {
        return (React.createElement(RN.Text, { style: this.props.style, ref: 'nativeLink', numberOfLines: this.props.numberOfLines === 0 ? null : this.props.numberOfLines, onPress: this._onPress, onLongPress: this._onLongPress, allowFontScaling: this.props.allowFontScaling, maxContentSizeMultiplier: this.props.maxContentSizeMultiplier }, this.props.children));
    }
}
exports.Link = Link;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Link;
