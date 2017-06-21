/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform View abstraction.
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
const PropTypes = require("prop-types");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const AnimateListEdits_1 = require("./listAnimations/AnimateListEdits");
const restyleForInlineText = require("./utils/restyleForInlineText");
const Styles_1 = require("./Styles");
const ViewBase_1 = require("./ViewBase");
const FocusManager_1 = require("./utils/FocusManager");
const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch'
    },
    // See resize detector comments in renderResizeDetectorIfNeeded() method below.
    resizeDetectorContainerStyles: {
        position: 'absolute',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        overflow: 'scroll',
        zIndex: '-1',
        visibility: 'hidden'
    },
    resizeGrowDetectorStyles: {
        position: 'absolute',
        left: '100500px',
        top: '100500px',
        width: '1px',
        height: '1px'
    },
    resizeShrinkDetectorStyles: {
        position: 'absolute',
        width: '150%',
        height: '150%'
    }
};
if (typeof document !== 'undefined') {
    const ignorePointerEvents = '.reactxp-ignore-pointer-events  * { pointer-events: auto; }';
    const head = document.head;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(ignorePointerEvents));
    head.appendChild(style);
}
class View extends ViewBase_1.default {
    constructor(props) {
        super(props);
        this._resizeDetectorNodes = {};
        if (props.restrictFocusWithin) {
            this._focusManager = new FocusManager_1.FocusManager();
        }
    }
    _renderResizeDetectorIfNeeded(containerStyles) {
        // If needed, additional invisible DOM elements will be added inside the
        // view to track the size changes that are performed behind our back by
        // the browser's layout engine faster (ViewBase checks for the layout
        // updates once a second and sometimes it's not fast enough).
        // Unfortunately <div> doesn't have `resize` event, so we're trying to
        // detect the fact that the view has been resized with `scroll` events.
        // To do that, we create two scrollable <div>s and we put them into a
        // state in which `scroll` event is triggered by the browser when the
        // container gets resized (one element triggers `scroll` when the
        // container gets bigger, another triggers `scroll` when the container
        // gets smaller).
        if (!this.props.importantForLayout) {
            return null;
        }
        if (containerStyles.position !== 'relative') {
            console.error('View: importantForLayout property is applicable only for a view with relative position');
            return null;
        }
        let initResizer = (key, ref) => {
            const cur = this._resizeDetectorNodes[key];
            const element = ReactDOM.findDOMNode(ref);
            if (cur) {
                delete this._resizeDetectorNodes[key];
            }
            if (element) {
                this._resizeDetectorNodes[key] = element;
            }
            this._resizeDetectorOnScroll();
        };
        return [
            (React.createElement("div", { key: 'grow', style: _styles.resizeDetectorContainerStyles, ref: (ref) => initResizer('grow', ref), onScroll: () => this._resizeDetectorOnScroll() },
                React.createElement("div", { style: _styles.resizeGrowDetectorStyles }))),
            (React.createElement("div", { key: 'shrink', style: _styles.resizeDetectorContainerStyles, ref: (ref) => initResizer('shrink', ref), onScroll: () => this._resizeDetectorOnScroll() },
                React.createElement("div", { style: _styles.resizeShrinkDetectorStyles })))
        ];
    }
    _resizeDetectorReset() {
        // Scroll the detectors to the bottom-right corner so
        // that `scroll` events will be triggered when the container
        // is resized.
        const scrollMax = 100500;
        let node = this._resizeDetectorNodes.grow;
        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }
        node = this._resizeDetectorNodes.shrink;
        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }
    }
    _resizeDetectorOnScroll() {
        if (this._resizeDetectorAnimationFrame) {
            // Do not execute action more often than once per animation frame.
            return;
        }
        this._resizeDetectorAnimationFrame = window.requestAnimationFrame(() => {
            this._resizeDetectorReset();
            this._resizeDetectorAnimationFrame = undefined;
            ViewBase_1.default._checkViews();
        });
    }
    getChildContext() {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        let childContext = {
            isRxParentAText: false
        };
        // Provide the descendants with the focus manager (if any).
        if (this._focusManager) {
            childContext.focusManager = this._focusManager;
        }
        return childContext;
    }
    _getContainerRef() {
        return this;
    }
    render() {
        let combinedStyles = Styles_1.default.combine(_styles.defaultStyle, this.props.style);
        const ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits);
        const ariaSelected = AccessibilityUtil_1.default.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        let props = {
            role: ariaRole,
            tabIndex: this.props.tabIndex,
            style: combinedStyles,
            title: this.props.title,
            'aria-label': this.props.accessibilityLabel,
            'aria-hidden': isAriaHidden,
            'aria-selected': ariaSelected,
            onContextMenu: this.props.onContextMenu,
            onMouseEnter: this.props.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
            onMouseOver: this.props.onMouseOver,
            onMouseMove: this.props.onMouseMove,
            onDragEnter: this.props.onDragEnter,
            onDragOver: this.props.onDragOver,
            onDragLeave: this.props.onDragLeave,
            onDrop: this.props.onDrop,
            onClick: this.props.onPress,
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyDown: this.props.onKeyPress,
        };
        if (this.props.ignorePointerEvents) {
            props.className = 'reactxp-ignore-pointer-events';
            combinedStyles['pointerEvents'] = 'none';
        }
        let reactElement;
        let childAnimationsEnabled = this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave;
        if (childAnimationsEnabled) {
            reactElement = (React.createElement(AnimateListEdits_1.default, __assign({}, props, { animateChildEnter: this.props.animateChildEnter, animateChildMove: this.props.animateChildMove, animateChildLeave: this.props.animateChildLeave }), this.props.children));
        }
        else {
            reactElement = (React.createElement("div", __assign({}, props),
                this._renderResizeDetectorIfNeeded(combinedStyles),
                this.props.children));
        }
        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    }
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (!!this.props.restrictFocusWithin !== !!nextProps.restrictFocusWithin) {
            console.error('View: restrictFocusWithin is readonly and changing it during the component life cycle has no effect');
        }
    }
    componentDidMount() {
        super.componentDidMount();
        if (this._focusManager) {
            this._focusManager.restrictFocusWithin();
        }
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        if (this._focusManager) {
            this._focusManager.release();
        }
    }
}
View.contextTypes = {
    isRxParentAText: PropTypes.bool,
    focusManager: PropTypes.object
};
View.childContextTypes = {
    isRxParentAText: PropTypes.bool.isRequired,
    focusManager: PropTypes.object
};
exports.View = View;
FocusManager_1.applyFocusableComponentMixin(View, function (nextProps) {
    let tabIndex = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined && tabIndex !== -1;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = View;
