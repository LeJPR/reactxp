/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Animation abstraction.
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
const React = require("react");
const RN = require("react-native");
const Easing_1 = require("../common/Easing");
const Image_1 = require("./Image");
const View_1 = require("./View");
const Text_1 = require("./Text");
const TextInput_1 = require("./TextInput");
const RX = require("../common/Interfaces");
const ReactNativeAnimatedClasses = {
    Image: RN.Animated.createAnimatedComponent(Image_1.default),
    Text: RN.Animated.createAnimatedComponent(Text_1.default),
    TextInput: RN.Animated.createAnimatedComponent(TextInput_1.default),
    View: RN.Animated.createAnimatedComponent(View_1.default, true)
};
class AnimatedImage extends RX.AnimatedImage {
    setNativeProps(props) {
        const nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }
    render() {
        return (React.createElement(ReactNativeAnimatedClasses.Image, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style }), this.props.children));
    }
}
exports.AnimatedImage = AnimatedImage;
class AnimatedText extends RX.AnimatedText {
    setNativeProps(props) {
        const nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }
    render() {
        return (React.createElement(ReactNativeAnimatedClasses.Text, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style }), this.props.children));
    }
}
exports.AnimatedText = AnimatedText;
class AnimatedTextInput extends RX.AnimatedTextInput {
    setNativeProps(props) {
        const nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }
    focus() {
        const nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.focus();
        }
    }
    blur() {
        const nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.blur();
        }
    }
    render() {
        return (React.createElement(ReactNativeAnimatedClasses.TextInput, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style })));
    }
}
exports.AnimatedTextInput = AnimatedTextInput;
class AnimatedView extends RX.AnimatedView {
    setNativeProps(props) {
        const nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }
    focus() {
        // Native mobile platform doesn't have the notion of focus for AnimatedViews, so ignore
    }
    blur() {
        // Native mobile platform doesn't have the notion of blur for AnimatedViews, so ignore
    }
    render() {
        return (React.createElement(ReactNativeAnimatedClasses.View, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style }), this.props.children));
    }
}
exports.AnimatedView = AnimatedView;
var timing = function (value, config) {
    let isLooping = config.loop !== undefined && config.loop != null;
    return {
        start: function (callback) {
            function animate() {
                let timingConfig = {
                    toValue: config.toValue,
                    easing: config.easing ? config.easing : null,
                    duration: config.duration,
                    delay: config.delay,
                    isInteraction: config.isInteraction,
                    useNativeDriver: config.useNativeDriver
                };
                RN.Animated.timing(value, timingConfig).start((r) => {
                    if (callback) {
                        callback(r);
                    }
                    if (isLooping) {
                        value.setValue(config.loop.restartFrom);
                        // Hack to get into the loop
                        animate();
                    }
                });
            }
            // Trigger animation loop (hack for now)
            animate();
        },
        stop: function () {
            isLooping = false;
            value.stopAnimation();
        },
    };
};
exports.Animated = {
    Image: AnimatedImage,
    Text: AnimatedText,
    TextInput: AnimatedTextInput,
    View: AnimatedView,
    Value: RN.Animated.Value,
    Easing: Easing_1.default,
    timing: timing,
    delay: RN.Animated.delay,
    parallel: RN.Animated.parallel,
    sequence: RN.Animated.sequence
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.Animated;
