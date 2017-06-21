/**
* AnimateListEdits.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Each time the component receives new children, animates insertions, removals,
* and moves that occurred since the previous render.
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
const MonitorListEdits = require("./MonitorListEdits");
const executeTransition_1 = require("../animated/executeTransition");
class AnimateListEdits extends React.Component {
    _handleWillAnimate(edits, done) {
        let counter = 1;
        let animationCompleted = function () {
            --counter;
            if (counter === 0) {
                done();
            }
        };
        let delay = 0;
        if (edits.removed.length > 0 && this.props.animateChildLeave) {
            edits.removed.forEach(function (move) {
                let domNode = ReactDOM.findDOMNode(move.element);
                if (domNode) {
                    domNode.style.transform = 'translateY(' + -move.topDelta + 'px)';
                    counter++;
                    executeTransition_1.default(domNode, [{
                            property: 'opacity',
                            from: 1,
                            to: 0,
                            delay: delay,
                            duration: 150,
                            timing: 'linear'
                        }], animationCompleted);
                }
            });
            delay += 75;
        }
        if (edits.moved.length > 0 && this.props.animateChildMove) {
            edits.moved.forEach(function (move) {
                counter++;
                let domNode = ReactDOM.findDOMNode(move.element);
                if (domNode) {
                    executeTransition_1.default(domNode, [{
                            property: 'transform',
                            from: 'translateY(' + -move.topDelta + 'px)',
                            to: '',
                            delay: delay,
                            duration: 300,
                            timing: 'ease-out'
                        }], animationCompleted);
                }
            });
        }
        delay += 75;
        if (edits.added.length > 0 && this.props.animateChildEnter) {
            edits.added.forEach(function (move) {
                counter++;
                executeTransition_1.default(ReactDOM.findDOMNode(move.element), [{
                        property: 'opacity',
                        from: 0,
                        to: 1,
                        delay: delay,
                        duration: 150,
                        timing: 'linear'
                    }], animationCompleted);
            });
        }
        animationCompleted();
    }
    render() {
        return (React.createElement(MonitorListEdits.MonitorListEdits, __assign({ componentWillAnimate: (edits, done) => this._handleWillAnimate(edits, done) }, this.props), this.props.children));
    }
}
exports.AnimateListEdits = AnimateListEdits;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimateListEdits;
