/**
* Picker.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Picker abstraction.
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
const RX = require("../common/Interfaces");
class Picker extends RX.Picker {
    constructor() {
        super(...arguments);
        this.onValueChange = (itemValue, itemPosition) => {
            this.props.onValueChange(itemValue, itemPosition);
        };
    }
    render() {
        return (React.createElement(RN.Picker, { selectedValue: this.props.selectedValue, onValueChange: this.onValueChange, style: this.props.style }, _.map(this.props.items, (i, idx) => React.createElement(RN.Picker.Item, __assign({}, i, { key: idx })))));
    }
}
exports.Picker = Picker;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Picker;
