/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements animated components for web version of ReactXP.
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
const ReactDOM = require("react-dom");
const Easing_1 = require("../common/Easing");
exports.Easing = Easing_1.default;
const Image_1 = require("./Image");
const View_1 = require("./View");
const Text_1 = require("./Text");
const TextInput_1 = require("./TextInput");
const RX = require("../common/Interfaces");
const WebAnimated = require("animated");
const AnimatedProps = require("animated/lib/AnimatedProps");
const CSSPropertyOperations = require("react-dom/lib/CSSPropertyOperations");
// Animated Css Property Units - check /common/Types for the list of available
// css animated properties
var animatedPropUnits = {
    // AnimatedFlexboxStyleRules
    height: 'px',
    width: 'px',
    left: 'px',
    right: 'px',
    top: 'px',
    bottom: 'px',
    // AnimatedTransformStyleRules
    perspective: '',
    rotate: 'deg',
    rotateX: 'deg',
    rotateY: 'deg',
    scale: '',
    scaleX: '',
    scaleY: '',
    scaleZ: '',
    translateX: 'px',
    translateY: 'px',
    skewX: '',
    skewY: '',
    // AnimatedViewAndImageCommonStyleRules
    backgroundColor: '',
    opacity: '',
    borderRadius: 'px',
    // AnimatedTextStyleRules
    color: '',
    fontSize: ''
};
// For ReactXP web we need to flatten the styles prop. This can be a recursive flatten as it may be as array of array.
// Need to look into most performant way.
var Flatten = function (styles) {
    var array = Array.isArray(styles);
    if (array) {
        var flatArray = {};
        styles.forEach(function (style) {
            var newStyle = Flatten(style);
            flatArray = __assign({}, flatArray, newStyle);
        });
        return flatArray;
    }
    else {
        return styles;
    }
};
WebAnimated.inject.FlattenStyle(function (styles) {
    return Flatten(styles);
});
// For ReactXP web we need to apply the animated values, as presented by RX.Styles.createAnimatedViewStyle.
// { scale: 2 } => 'scale(2)'
function mapTransform(t) {
    var k = Object.keys(t)[0];
    var x = animatedPropUnits[k];
    return `${k}(${t[k]}${x})`;
}
function mapStyle(style) {
    if (style && style.transform && typeof style.transform !== 'string') {
        style.transform = style.transform.map(mapTransform).join(' ');
    }
    return style;
}
function SetAnimatedValues(instance, props, comp) {
    if (instance.setNativeProps) {
        instance.setNativeProps(props);
    }
    else if (instance.nodeType && instance.setAttribute !== undefined) {
        CSSPropertyOperations.setValueForStyles(instance, mapStyle(props.style), comp._reactInternalInstance);
    }
    else {
        return false;
    }
}
function ApplyAnimatedValues(instance, props, comp) {
    var element = ReactDOM.findDOMNode(comp.refs['animatedNode']);
    return SetAnimatedValues(element, props, comp);
}
WebAnimated
    .inject
    .ApplyAnimatedValues(ApplyAnimatedValues);
function createAnimatedComponent(Component) {
    var refName = 'animatedNode';
    class AnimatedComponent extends RX.Component {
        componentWillUnmount() {
            this._propsAnimated && this._propsAnimated.__detach();
        }
        setNativeProps(props) {
            var didUpdate = ApplyAnimatedValues(this.refs[refName], props, this);
            if (didUpdate === false) {
                this.forceUpdate();
            }
        }
        componentWillMount() {
            this.attachProps(this.props);
        }
        attachProps(nextProps) {
            var oldPropsAnimated = this._propsAnimated;
            // The system is best designed when setNativeProps is implemented. It is
            // able to avoid re-rendering and directly set the attributes that
            // changed. However, setNativeProps can only be implemented on leaf
            // native components. If you want to animate a composite component, you
            // need to re-render it. In this case, we have a fallback that uses
            // forceUpdate.
            var callback = () => {
                var didUpdate = ApplyAnimatedValues(this.refs[refName], this._propsAnimated.__getAnimatedValue(), this);
                if (didUpdate === false) {
                    this.forceUpdate();
                }
            };
            let newProps = new AnimatedProps(nextProps, callback);
            this._propsAnimated = newProps;
            // When you call detach, it removes the element from the parent list
            // of children. If it goes to 0, then the parent also detaches itself
            // and so on.
            // An optimization is to attach the new elements and THEN detach the old
            // ones instead of detaching and THEN attaching.
            // This way the intermediate state isn't to go to 0 and trigger
            // this expensive recursive detaching to then re-attach everything on
            // the very next operation.
            oldPropsAnimated && oldPropsAnimated.__detach();
        }
        componentWillReceiveProps(nextProps) {
            this.attachProps(nextProps);
        }
        render() {
            let props = this._propsAnimated.__getValue();
            // Set  properties for first render
            if (!this.init && props.style) {
                props.style = mapStyle(props.style);
                this.init = true;
            }
            return (React.createElement(Component, __assign({}, props, { ref: refName })));
        }
    }
    return AnimatedComponent;
}
exports.Image = createAnimatedComponent(Image_1.default);
exports.Text = createAnimatedComponent(Text_1.default);
exports.TextInput = createAnimatedComponent(TextInput_1.default);
exports.View = createAnimatedComponent(View_1.default);
exports.spring = WebAnimated.spring;
exports.timing = WebAnimated.timing;
exports.sequence = WebAnimated.sequence;
exports.parallel = WebAnimated.parallel;
exports.Value = WebAnimated.Value;
