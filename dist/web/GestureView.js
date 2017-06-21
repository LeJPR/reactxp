/**
* GestureView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform GestureView component.
* It provides support for the scroll wheel, clicks and double clicks.
*/
"use strict";
const _ = require("./utils/lodashMini");
const React = require("react");
const MouseResponder_1 = require("./utils/MouseResponder");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const Types = require("../common/Types");
const _styles = {
    defaultView: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center'
    }
};
const _doubleTapDurationThreshold = 250;
const _doubleTapPixelThreshold = 20;
const _panPixelThreshold = 10;
const _preferredPanRatio = 3;
var GestureType;
(function (GestureType) {
    GestureType[GestureType["None"] = 0] = "None";
    GestureType[GestureType["Pan"] = 1] = "Pan";
    GestureType[GestureType["PanVertical"] = 2] = "PanVertical";
    GestureType[GestureType["PanHorizontal"] = 3] = "PanHorizontal";
})(GestureType || (GestureType = {}));
let _idCounter = 1;
class GestureView extends RX.GestureView {
    constructor() {
        super(...arguments);
        // State for tracking double taps
        this._doubleTapTimer = null;
        this._lastTapEvent = null;
        // private _pendingGestureState: Types.PanGestureState = null;
        this._pendingGestureType = GestureType.None;
        this._gestureTypeLocked = false;
        this._skipNextTap = false;
        this._setContainerRef = (container) => {
            // safe since div refs resolve into HTMLElement and not react element.
            this._container = container;
        };
        this._onClick = (e) => {
            if (!this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                this._sendTapEvent(e);
            }
            else if (this._isDoubleTap(e)) {
                // This is a double-tap, so swallow the previous single tap.
                this._cancelDoubleTapTimer();
                this._sendDoubleTapEvent(e);
                this._lastTapEvent = null;
            }
            else {
                // This wasn't a double-tap. Report any previous single tap and start the double-tap
                // timer so we can determine whether the current tap is a single or double.
                this._reportDelayedTap();
                this._startDoubleTapTimer(e);
            }
        };
        this._detectGestureType = (gestureState) => {
            // we need to lock gesture type until it's completed
            if (this._gestureTypeLocked) {
                return this._pendingGestureType;
            }
            this._gestureTypeLocked = true;
            if (this._shouldRespondToPan(gestureState)) {
                return GestureType.Pan;
            }
            else if (this._shouldRespondToPanVertical(gestureState)) {
                return GestureType.PanVertical;
            }
            else if (this._shouldRespondToPanHorizontal(gestureState)) {
                return GestureType.PanHorizontal;
            }
            this._gestureTypeLocked = false;
            return GestureType.None;
        };
        this._getPanPixelThreshold = () => {
            return this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
        };
        this._onWheel = (e) => {
            if (this.props.onScrollWheel) {
                const clientRect = this._getGestureViewClientRect();
                const scrollWheelEvent = {
                    clientX: e.clientX - clientRect.left,
                    clientY: e.clientY - clientRect.top,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    scrollAmount: e.deltaY,
                    timeStamp: e.timeStamp
                };
                this.props.onScrollWheel(scrollWheelEvent);
            }
        };
        this._sendPanEvent = (gestureState) => {
            switch (this._pendingGestureType) {
                case GestureType.Pan:
                    this.props.onPan(gestureState);
                    break;
                case GestureType.PanVertical:
                    this.props.onPanVertical(gestureState);
                    break;
                case GestureType.PanHorizontal:
                    this.props.onPanHorizontal(gestureState);
                    break;
                default:
            }
            // we need to clean taps in case there was a pan event in the meantime
            if (this._pendingGestureType !== GestureType.None) {
                this._lastTapEvent = null;
                this._cancelDoubleTapTimer();
                this._skipNextTap = true;
            }
        };
    }
    componentDidMount() {
        this._id = _idCounter++;
        this._responder = MouseResponder_1.default.create({
            id: this._id,
            target: this._container,
            shouldBecomeFirstResponder: (event) => {
                if (!this.props.onPan && !this.props.onPanHorizontal && !this.props.onPanVertical) {
                    return false;
                }
                const { top, left, bottom, right } = this._container.getBoundingClientRect();
                const { clientX, clientY } = event;
                if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
                    return true;
                }
                return false;
            },
            onMove: (event, gestureState) => {
                this._pendingGestureType = this._detectGestureType(gestureState);
                this._sendPanEvent(gestureState);
            },
            onTerminate: (event, gestureState) => {
                this._pendingGestureType = this._detectGestureType(gestureState);
                this._sendPanEvent(gestureState);
                this._pendingGestureType = GestureType.None;
                this._gestureTypeLocked = false;
            }
        });
    }
    componentWillUnmount() {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
        if (this._responder) {
            this._responder.dispose();
        }
    }
    render() {
        return (React.createElement("div", { style: this._getStyles(), ref: this._setContainerRef, onClick: this._onClick, onWheel: this._onWheel }, this.props.children));
    }
    _getStyles() {
        let combinedStyles = Styles_1.default.combine(_styles.defaultView, this.props.style);
        let cursorName = null;
        switch (this.props.mouseOverCursor) {
            case Types.GestureMouseCursor.Grab:
                cursorName = 'grab';
                break;
            case Types.GestureMouseCursor.Move:
                cursorName = 'move';
                break;
            case Types.GestureMouseCursor.Pointer:
                cursorName = 'pointer';
                break;
        }
        if (cursorName) {
            combinedStyles['cursor'] = cursorName;
        }
        return combinedStyles;
    }
    _shouldRespondToPan(gestureState) {
        if (!this.props.onPan) {
            return false;
        }
        const threshold = this._getPanPixelThreshold();
        const distance = this._calcDistance(gestureState.clientX - gestureState.initialClientX, gestureState.clientY - gestureState.initialClientY);
        if (distance < threshold) {
            return false;
        }
        return true;
    }
    _shouldRespondToPanVertical(gestureState) {
        if (!this.props.onPanVertical) {
            return false;
        }
        const dx = gestureState.clientX - gestureState.initialClientX;
        const dy = gestureState.clientY - gestureState.initialClientY;
        // Has the user started to pan?
        const panThreshold = this._getPanPixelThreshold();
        const isPan = Math.abs(dy) >= panThreshold;
        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Horizontal) {
            return Math.abs(dy) > Math.abs(dx * _preferredPanRatio);
        }
        return isPan;
    }
    _shouldRespondToPanHorizontal(gestureState) {
        if (!this.props.onPanHorizontal) {
            return false;
        }
        const dx = gestureState.clientX - gestureState.initialClientX;
        const dy = gestureState.clientY - gestureState.initialClientY;
        // Has the user started to pan?
        const panThreshold = this._getPanPixelThreshold();
        const isPan = Math.abs(dx) >= panThreshold;
        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Vertical) {
            return Math.abs(dx) > Math.abs(dy * _preferredPanRatio);
        }
        return isPan;
    }
    _calcDistance(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }
    // This method assumes that the caller has already determined that two
    // clicks have been detected in a row. It is responsible for determining if
    // they occurred within close proximity and within a certain threshold of time.
    _isDoubleTap(e) {
        const timeStamp = e.timeStamp.valueOf();
        const pageX = e.pageX;
        const pageY = e.pageY;
        if (!this._lastTapEvent) {
            return false;
        }
        return (timeStamp - this._lastTapEvent.timeStamp.valueOf() <= _doubleTapDurationThreshold &&
            this._calcDistance(this._lastTapEvent.pageX - pageX, this._lastTapEvent.pageY - pageY) <=
                _doubleTapPixelThreshold);
    }
    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    _startDoubleTapTimer(e) {
        this._lastTapEvent = _.clone(e);
        this._doubleTapTimer = window.setTimeout(() => {
            this._reportDelayedTap();
            this._doubleTapTimer = null;
        }, _doubleTapDurationThreshold);
    }
    // Cancels any pending double-tap timer.
    _cancelDoubleTapTimer() {
        if (this._doubleTapTimer) {
            clearTimeout(this._doubleTapTimer);
            this._doubleTapTimer = null;
        }
    }
    // If there was a previous tap recorded but we haven't yet reported it because we were
    // waiting for a potential second tap, report it now.
    _reportDelayedTap() {
        if (this._lastTapEvent && this.props.onTap) {
            this._sendTapEvent(this._lastTapEvent);
            this._lastTapEvent = null;
        }
    }
    _sendTapEvent(e) {
        // we need to skip tap after succesfull pan event
        // mouse up would otherwise trigger both pan & tap
        if (this._skipNextTap) {
            this._skipNextTap = false;
            return;
        }
        if (this.props.onTap) {
            const clientRect = this._getGestureViewClientRect();
            const tapEvent = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX - clientRect.left,
                clientY: e.clientY - clientRect.top,
                timeStamp: e.timeStamp
            };
            this.props.onTap(tapEvent);
        }
    }
    _sendDoubleTapEvent(e) {
        if (this.props.onDoubleTap) {
            const clientRect = this._getGestureViewClientRect();
            const tapEvent = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX - clientRect.left,
                clientY: e.clientY - clientRect.top,
                timeStamp: e.timeStamp
            };
            this.props.onDoubleTap(tapEvent);
        }
    }
    _getGestureViewClientRect() {
        return this._container.getBoundingClientRect();
    }
}
exports.GestureView = GestureView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GestureView;
