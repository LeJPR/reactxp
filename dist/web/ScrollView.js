/**
* ScrollView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform ScrollView abstraction.
*/
"use strict";
const _ = require("./utils/lodashMini");
const React = require("react");
const ReactDOM = require("react-dom");
const CustomScrollbar_1 = require("./CustomScrollbar");
const Styles_1 = require("./Styles");
const ScrollViewConfig_1 = require("./ScrollViewConfig");
const ViewBase_1 = require("./ViewBase");
let _styles = {
    defaultStyle: {
        position: 'relative',
        overflow: 'hidden',
        alignSelf: 'stretch',
        flex: '1 1 auto',
        // This forces some browsers (like Chrome) to create a new render context,
        // which can significantly speed up scrolling.
        transform: 'translateZ(0)'
    },
    verticalStyle: {
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    horizontalStyle: {
        flexDirection: 'row',
        overflowY: 'hidden',
        overflowX: 'auto'
    },
    bothStyle: {
        overflowY: 'auto',
        overflowX: 'auto'
    }
};
let _initializedCustomStyles = false;
let _customStyles = {
    defaultStyle: {
        overflow: 'hidden',
        msOverflowStyle: 'auto',
        flexDirection: 'column',
        // This forces some browsers (like Chrome) to create a new render context,
        // which can significantly speed up scrolling.
        transform: 'translateZ(0)'
    },
    verticalStyle: {},
    horizontalStyle: {},
    bothStyle: {},
    customScrollContainer: {
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        alignSelf: 'stretch'
    },
    customScrollVertical: {
        // Set flex only for vertical scroll view.
        // Don't set flex for horizontal scroll view, otherwise it disappears.
        display: 'flex',
        flex: '1 1 0px'
    }
};
// Default to once per frame.
const _defaultScrollThrottleValue = 1000 / 60;
class ScrollView extends ViewBase_1.default {
    constructor(props) {
        super(props);
        this._customScrollbarEnabled = true;
        this._dragging = false;
        // Throttled scroll handler
        this._onScroll = _.throttle((e) => {
            if (this._customScrollbarEnabled) {
                this._customScrollbar.update();
            }
            // Check if this should be also fire an onLayout event
            // The browser sends a scroll event when resizing
            const onLayoutPromise = this._checkAndReportLayout();
            // Recent versions of Chrome have started to defer all timers until
            // after scrolling has completed. Because of this, our deferred layout
            // reporting sometimes doesn't get handled for up to seconds at a time.
            // Force the list of deferred changes to be reported now.
            ViewBase_1.default._reportDeferredLayoutChanges();
            if (this.props.onScroll) {
                onLayoutPromise.then(() => {
                    const container = this._getContainer();
                    if (!container) {
                        return;
                    }
                    this.props.onScroll(container.scrollTop, container.scrollLeft);
                });
            }
        }, (this.props.scrollEventThrottle || _defaultScrollThrottleValue), { leading: true, trailing: true });
        this._onTouchStart = () => {
            if (!this._dragging) {
                this._dragging = true;
                this.props.onScrollBeginDrag();
            }
        };
        this._onTouchEnd = () => {
            this._dragging = false;
            this.props.onScrollEndDrag();
        };
        // Set final styles upon initialization of the first ScrollView. This was previously done in the head
        // of this file, but it broke the pattern of not doing external work (such as accessing the document
        // object) on Types initialization.
        if (!_initializedCustomStyles) {
            _initializedCustomStyles = true;
            const nativeScrollbarWidth = CustomScrollbar_1.default.getNativeScrollbarWidth();
            _customStyles.verticalStyle = {
                overflowY: 'scroll',
                paddingRight: 30 - nativeScrollbarWidth,
                marginRight: -30,
                // Fixes a bug for Chrome beta where the parent flexbox (customScrollContainer) doesn't 
                // recognize that its child got populated with items. Smallest default width gives an 
                // indication that content will exist here.
                minHeight: 0
            };
            _customStyles.horizontalStyle = {
                // The display needs to be set to flex, otherwise the scrollview incorrectly shows up vertically.
                display: 'flex',
                overflowX: 'scroll',
                paddingBottom: 30 - nativeScrollbarWidth,
                marginBottom: -30,
                // Fixes a bug for Chrome beta where the parent flexbox (customScrollContainer) doesn't 
                // recognize that its child got populated with items. Smallest default width gives an 
                // indication that content will exist here.
                minWidth: 0
            };
            _customStyles.bothStyle = Styles_1.default.combine(null, [_customStyles.verticalStyle, _customStyles.horizontalStyle]);
        }
    }
    componentDidUpdate() {
        super.componentDidUpdate();
        if (!this.props.onContentSizeChange) {
            return;
        }
        _.defer(() => {
            if (this.props.onContentSizeChange) {
                const container = this._getContainer();
                if (!container) {
                    return;
                }
                this.props.onContentSizeChange(container.scrollWidth, container.scrollHeight);
            }
        });
    }
    render() {
        return this._customScrollbarEnabled ? this._renderWithCustomScrollbar() : this._renderNormal();
    }
    componentWillMount() {
        this._onPropsChange(this.props);
    }
    componentDidMount() {
        super.componentDidMount();
        if (this._customScrollbarEnabled) {
            let element = ReactDOM.findDOMNode(this);
            if (element) {
                this._customScrollbar = new CustomScrollbar_1.default(element);
                this._customScrollbar.init({ horizontal: this.props.horizontal, vertical: this.props.vertical });
            }
        }
    }
    componentWillReceiveProps(newProps) {
        super.componentWillReceiveProps(newProps);
        this._onPropsChange(newProps);
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        if (this._customScrollbarEnabled) {
            this._customScrollbar.dispose();
        }
    }
    _getContainerRef() {
        return this.refs['scrollView'];
    }
    _onPropsChange(props) {
        this._customScrollbarEnabled = ScrollViewConfig_1.default.useCustomScrollbars();
    }
    _getContainerStyle() {
        let styles = [{ display: 'block' }];
        let sourceStyles = this._customScrollbarEnabled ? _customStyles : _styles;
        styles.push(sourceStyles.defaultStyle);
        if (this.props.horizontal && this.props.vertical) {
            styles.push(sourceStyles.bothStyle);
        }
        else if (this.props.horizontal) {
            styles.push(sourceStyles.horizontalStyle);
        }
        else {
            styles.push(sourceStyles.verticalStyle);
        }
        let defaultStyle = Styles_1.default.combine(null, styles);
        return Styles_1.default.combine(defaultStyle, this.props.style);
    }
    _renderNormal() {
        return (React.createElement("div", { ref: 'scrollView', onScroll: this._onScroll, onTouchStart: this._onTouchStart, onTouchEnd: this._onTouchEnd, style: this._getContainerStyle() }, this.props.children));
    }
    _renderWithCustomScrollbar() {
        let containerStyles = _customStyles.customScrollContainer;
        if (this.props.justifyEnd) {
            containerStyles = _.extend({ justifyContent: 'flex-end' }, containerStyles);
        }
        let scrollComponentClassNames = ['scrollViewport'];
        if (this.props.horizontal) {
            scrollComponentClassNames.push('scrollViewportH');
        }
        if (this.props.vertical || this.props.vertical === undefined) {
            scrollComponentClassNames.push('scrollViewportV');
            containerStyles = _.extend({}, _customStyles.customScrollVertical, containerStyles);
        }
        return (React.createElement("div", { className: 'rxCustomScroll', style: containerStyles },
            React.createElement("div", { ref: 'scrollView', className: scrollComponentClassNames.join(' '), onScroll: this._onScroll, style: this._getContainerStyle(), onKeyDown: this.props.onKeyPress, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onTouchStart: this._onTouchStart, onTouchEnd: this._onTouchEnd }, this.props.children)));
    }
    setScrollTop(scrollTop, animate = false) {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        if (animate) {
            const start = container.scrollTop;
            const change = scrollTop - start;
            const increment = 20;
            const duration = 200;
            const animateScroll = (elapsedTime) => {
                elapsedTime += increment;
                var position = this._easeInOut(elapsedTime, start, change, duration);
                container.scrollTop = position;
                if (elapsedTime < duration) {
                    window.setTimeout(function () {
                        animateScroll(elapsedTime);
                    }, increment);
                }
            };
            animateScroll(0);
        }
        else {
            container.scrollTop = scrollTop;
        }
    }
    setScrollLeft(scrollLeft, animate = false) {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        if (animate) {
            const start = container.scrollLeft;
            const change = scrollLeft - start;
            const increment = 20;
            const duration = 200;
            const animateScroll = (elapsedTime) => {
                elapsedTime += increment;
                var position = this._easeInOut(elapsedTime, start, change, duration);
                container.scrollLeft = position;
                if (elapsedTime < duration) {
                    window.setTimeout(function () {
                        animateScroll(elapsedTime);
                    }, increment);
                }
            };
            animateScroll(0);
        }
        else {
            container.scrollLeft = scrollLeft;
        }
    }
    addToScrollTop(deltaTop, animate) {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        this.setScrollTop(container.scrollTop + deltaTop, animate);
    }
    addToScrollLeft(deltaLeft, animate) {
        const container = this._getContainer();
        if (!container) {
            return;
        }
        this.setScrollLeft(container.scrollLeft + deltaLeft, animate);
    }
    _easeInOut(currentTime, start, change, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }
}
exports.ScrollView = ScrollView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollView;
