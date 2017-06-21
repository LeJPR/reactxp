/**
* ViewBase.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A base class for the Web-specific implementation of the cross-platform View abstraction.
*/
"use strict";
const _ = require("./utils/lodashMini");
const ReactDOM = require("react-dom");
const RX = require("../common/Interfaces");
const SyncTasks = require("synctasks");
const Types = require("../common/Types");
// We create a periodic timer to detect layout changes that are performed behind
// our back by the browser's layout engine. We do this more aggressively when
// the app is known to be active and in the foreground.
const _layoutTimerActiveDuration = 1000;
const _layoutTimerInactiveDuration = 10000;
class ViewBase extends RX.ViewBase {
    constructor() {
        super(...arguments);
        this._isMounted = false;
        this._lastX = 0;
        this._lastY = 0;
        this._lastWidth = 0;
        this._lastHeight = 0;
    }
    _getContainer() {
        // Perf: Don't prefetch this since we might never need it
        const containerRef = this._getContainerRef();
        if (!this._container && containerRef) {
            this._container = ReactDOM.findDOMNode(containerRef);
        }
        return this._container;
    }
    // Sets the activation state so we can stop our periodic timer
    // when the app is in the background.
    static setActivationState(newState) {
        if (ViewBase._appActivationState !== newState) {
            ViewBase._appActivationState = newState;
            // Cancel any existing timers.
            if (ViewBase._viewCheckingTimer) {
                window.clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = null;
            }
            if (ViewBase._viewCheckingList.length > 0) {
                // If we're becoming active, check and report layout changes immediately.
                if (newState === Types.AppActivationState.Active) {
                    ViewBase._checkViews();
                }
                ViewBase._viewCheckingTimer = setInterval(ViewBase._checkViews, newState === Types.AppActivationState.Active ?
                    _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!!this.props.onLayout !== !!nextProps.onLayout) {
            if (this.props.onLayout) {
                this._checkViewCheckerUnbuild();
            }
            if (nextProps.onLayout) {
                this._checkViewCheckerBuild();
            }
        }
    }
    static _checkViews() {
        _.each(ViewBase._viewCheckingList, view => {
            view._checkAndReportLayout();
        });
    }
    static _reportLayoutChange(func) {
        this._layoutReportList.push(func);
        if (!ViewBase._layoutReportingTimer) {
            ViewBase._layoutReportingTimer = window.setTimeout(() => {
                ViewBase._layoutReportingTimer = null;
                ViewBase._reportDeferredLayoutChanges();
            }, 0);
        }
    }
    static _reportDeferredLayoutChanges() {
        const reportList = this._layoutReportList;
        this._layoutReportList = [];
        _.each(reportList, func => {
            try {
                func();
            }
            catch (e) {
                console.error('Caught exception on onLayout response: ', e);
            }
        });
    }
    // Returns a promise to indicate when firing of onLayout event has completed (if any)
    _checkAndReportLayout() {
        if (!this._isMounted) {
            return SyncTasks.Resolved();
        }
        const container = this._getContainer();
        if (!container) {
            return SyncTasks.Resolved();
        }
        const newX = container.offsetLeft;
        const newY = container.offsetTop;
        const marginTop = !container.style.marginTop ? 0 : parseInt(container.style.marginTop, 10) || 0;
        const marginBottom = !container.style.marginBottom ? 0 : parseInt(container.style.marginBottom, 10) || 0;
        const marginRight = !container.style.marginRight ? 0 : parseInt(container.style.marginRight, 10) || 0;
        const marginLeft = !container.style.marginLeft ? 0 : parseInt(container.style.marginLeft, 10) || 0;
        const newWidth = container.offsetWidth + marginRight + marginLeft;
        const newHeight = container.offsetHeight + marginTop + marginBottom;
        if (this._lastX !== newX || this._lastY !== newY || this._lastWidth !== newWidth || this._lastHeight !== newHeight) {
            this._lastX = newX;
            this._lastY = newY;
            this._lastWidth = newWidth;
            this._lastHeight = newHeight;
            const deferred = SyncTasks.Defer();
            ViewBase._reportLayoutChange(() => {
                if (!this._isMounted || !this.props.onLayout) {
                    deferred.resolve();
                    return;
                }
                this.props.onLayout({
                    x: newX,
                    y: newY,
                    width: this._lastWidth,
                    height: this._lastHeight
                });
                deferred.resolve();
            });
            return deferred.promise();
        }
        return SyncTasks.Resolved();
    }
    _checkViewCheckerBuild() {
        // Enable the timer to check for layout changes. Use a different duration
        // when the app is active versus inactive.
        if (!ViewBase._viewCheckingTimer) {
            ViewBase._viewCheckingTimer = setInterval(ViewBase._checkViews, ViewBase._appActivationState === Types.AppActivationState.Active ?
                _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
        }
        if (!ViewBase._isResizeHandlerInstalled) {
            window.addEventListener('resize', ViewBase._onResize);
            ViewBase._isResizeHandlerInstalled = true;
        }
        ViewBase._viewCheckingList.push(this);
    }
    _checkViewCheckerUnbuild() {
        ViewBase._viewCheckingList = _.filter(ViewBase._viewCheckingList, v => v !== this);
        if (ViewBase._viewCheckingList.length === 0) {
            if (ViewBase._viewCheckingTimer) {
                clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = null;
            }
            if (ViewBase._isResizeHandlerInstalled) {
                window.removeEventListener('resize', ViewBase._onResize);
                ViewBase._isResizeHandlerInstalled = false;
            }
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (this.props.onLayout) {
            this._checkViewCheckerBuild();
        }
        // Chain through to the same render-checking code
        this.componentDidUpdate();
    }
    componentDidUpdate() {
        if (this.props.onLayout) {
            this._checkAndReportLayout();
        }
    }
    static _onResize() {
        // Often views change size in response to an overall window resize. Rather than
        // wait for the next timer to fire, do it immediately.
        ViewBase._checkViews();
    }
    componentWillUnmount() {
        this._isMounted = false;
        // Don't retain a reference to a DOM object. This can cause memory leaks
        // because the GC may not be able to clean them up.
        this._container = null;
        if (this.props.onLayout) {
            this._checkViewCheckerUnbuild();
        }
    }
    blur() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    }
    focus() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    }
}
ViewBase._viewCheckingTimer = null;
ViewBase._isResizeHandlerInstalled = false;
ViewBase._viewCheckingList = [];
ViewBase._appActivationState = Types.AppActivationState.Active;
ViewBase._layoutReportList = [];
ViewBase._layoutReportingTimer = null;
exports.ViewBase = ViewBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewBase;
