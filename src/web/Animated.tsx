/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements animated components for web version of ReactXP.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import ReactDOM = require('react-dom');
import Easing from '../common/Easing';
import RXImage from './Image';
import RXView from './View';
import RXText from './Text';
import RXTextInput from './TextInput';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');
import WebAnimated  = require('animated');
import AnimatedProps = require('animated/lib/AnimatedProps');
import CSSPropertyOperations = require('react-dom/lib/CSSPropertyOperations');

// Animated Css Property Units - check /common/Types for the list of available
// css animated properties
var animatedPropUnits: { [key: string]: string } = {
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
var Flatten = function (styles: any) {
    var array = Array.isArray(styles);
    if (array) {
        var flatArray = {};
        styles.forEach(function (style: any) {
            var newStyle = Flatten(style);
            flatArray = { ...flatArray, ...newStyle };
        });
        return flatArray;
    } else {
        return styles;
    }
};

WebAnimated.inject.FlattenStyle(function (styles: any) {
    return Flatten(styles);
});

// For ReactXP web we need to apply the animated values, as presented by RX.Styles.createAnimatedViewStyle.

// { scale: 2 } => 'scale(2)'
function mapTransform(t: string) {
    var k: any = Object.keys(t)[0];
    var x: string = animatedPropUnits[k];
    return `${k}(${t[k]}${x})`;
}

function mapStyle(style: any) {
    if (style && style.transform && typeof style.transform !== 'string') {
        style.transform = style.transform.map(mapTransform).join(' ');
    }
    return style;
}

function SetAnimatedValues(instance: any, props: any, comp: any) {
    if (instance.setNativeProps) {
        instance.setNativeProps(props);
    } else if (instance.nodeType && instance.setAttribute !== undefined) {
        CSSPropertyOperations.setValueForStyles(instance, mapStyle(props.style), comp._reactInternalInstance);
    } else {
        return false;
    }
}
function ApplyAnimatedValues(instance: any, props: any, comp: any) {
    var element = ReactDOM.findDOMNode(comp.refs['animatedNode']);
    return SetAnimatedValues(element, props, comp);
}

WebAnimated
    .inject
    .ApplyAnimatedValues(ApplyAnimatedValues);

function createAnimatedComponent(Component: any) {
    var refName = 'animatedNode';
    class AnimatedComponent extends RX.Component<any, any> {
        private init: boolean;
        private _propsAnimated: AnimatedProps;

        componentWillUnmount() {
            this._propsAnimated && this._propsAnimated.__detach();
        }

        setNativeProps(props: any) {
            var didUpdate = ApplyAnimatedValues(this.refs[refName], props, this);
            if (didUpdate === false) {
                this.forceUpdate();
            }
        }
        componentWillMount() {
            this.attachProps(this.props);
        }

        attachProps(nextProps: any) {
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
        componentWillReceiveProps(nextProps: any) {

            this.attachProps(nextProps);
        }
        render() {

            let props = this._propsAnimated.__getValue();

            // Set  properties for first render
            if (!this.init && props.style) {
                 props.style =  mapStyle(props.style);
                 this.init = true;
            }

            return (
                <Component
                    {...props}
                    ref={refName}
                />
            );

        }
    }
    return AnimatedComponent;
}

export var Image = createAnimatedComponent(RXImage) as typeof RX.AnimatedImage;
export var Text = createAnimatedComponent(RXText) as typeof RX.AnimatedText;
export var TextInput = createAnimatedComponent(RXTextInput) as typeof RX.AnimatedTextInput;
export var View = createAnimatedComponent(RXView) as typeof RX.AnimatedView;
export var spring: Types.Animated.TimingFunction = WebAnimated.spring;
export var timing: Types.Animated.TimingFunction = WebAnimated.timing;
export var sequence: Types.Animated.SequenceFunction = WebAnimated.sequence;
export var parallel: Types.Animated.ParallelFunction = WebAnimated.parallel;
export var Value = WebAnimated.Value;
export { Easing };
