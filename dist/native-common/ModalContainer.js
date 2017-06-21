/**
* ModalContainer.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Modal abstraction.
*/
"use strict";
const React = require("react");
const RN = require("react-native");
const _styles = {
    defaultContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }
};
class ModalContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(RN.View, { style: _styles.defaultContainer }, this.props.children));
    }
}
exports.ModalContainer = ModalContainer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModalContainer;
