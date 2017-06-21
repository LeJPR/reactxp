/**
* Picker.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Select abstraction.
*/
"use strict";
const _ = require("./utils/lodashMini");
const React = require("react");
const RX = require("../common/Interfaces");
class Picker extends RX.Picker {
    constructor() {
        super(...arguments);
        this.onValueChange = (e) => {
            const selectEl = e.target;
            const selectedValue = selectEl.value;
            const selectedItemPosition = _.findIndex(this.props.items, i => i.value === selectedValue);
            this.props.onValueChange(selectedValue, selectedItemPosition);
        };
    }
    render() {
        return (React.createElement("select", { value: this.props.selectedValue, onChange: this.onValueChange, style: this.props.style }, _.map(this.props.items, (i, idx) => React.createElement("option", { value: i.value, key: idx }, i.label))));
    }
}
exports.Picker = Picker;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Picker;
