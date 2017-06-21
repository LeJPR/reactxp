/**
* ActivityIndicator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Control to display an animated activity indicator.
*/
"use strict";
const React = require("react");
/* tslint:disable:no-unused-variable */
const RN = require("react-native");
/* tslint:enable:no-unused-variable */
const RX = require("../common/Interfaces");
class ActivityIndicator extends RX.ActivityIndicator {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = { isVisible: false };
    }
    componentDidMount() {
        this._isMounted = true;
        if (this.props.deferTime && this.props.deferTime > 0) {
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ isVisible: true });
                }
            }, this.props.deferTime);
        }
        else {
            this.setState({ isVisible: true });
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        let size;
        switch (this.props.size) {
            case 'tiny':
            case 'small':
                size = 'small';
                break;
            case 'medium':
                size = 'small';
                break; // React Native ActivityIndicator does not support 'medium' size
            case 'large':
                size = 'large';
                break;
            default:
                size = 'large';
                break;
        }
        return (React.createElement(RN.ActivityIndicator, { animating: this.state.isVisible, color: this.state.isVisible ? this.props.color : 'transparent', size: size }));
    }
}
exports.ActivityIndicator = ActivityIndicator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivityIndicator;
