/**
* PopupContainerView.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The view containing the Popup to show. This view does its own position
* calculation on rendering as directed by position instructions received
* through properties.
*/
"use strict";
const _ = require("./lodashMini");
const assert = require("assert");
const React = require("react");
const RN = require("react-native");
// Width of the "alley" around popups so they don't get too close to the boundary of the screen boundary.
const ALLEY_WIDTH = 2;
// How close to the edge of the popup should we allow the anchor offset to get before
// attempting a different position?
const MIN_ANCHOR_OFFSET = 16;
class PopupContainerView extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this._viewHandle = 0;
        this._respositionPopupTimer = null;
        this.state = this._getInitialState();
    }
    _getInitialState() {
        return {
            isMeasuringPopup: true,
            anchorPosition: 'left',
            anchorOffset: 0,
            popupTop: 0,
            popupLeft: 0,
            popupWidth: 0,
            popupHeight: 0,
            constrainedPopupWidth: 0,
            constrainedPopupHeight: 0
        };
    }
    componentWillReceiveProps(prevProps) {
        if (this.props.activePopupOptions !== prevProps.activePopupOptions) {
            // If the popup changes, reset our state.
            this.setState(this._getInitialState());
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.activePopupOptions) {
            this._recalcPosition();
            if (!this._respositionPopupTimer) {
                this._startRepositionPopupTimer();
            }
        }
        else {
            this._stopRepositionPopupTimer();
        }
    }
    componentDidMount() {
        this._viewHandle = RN.findNodeHandle(this.refs['popupContainerView']);
        this._isMounted = true;
        if (this.props.activePopupOptions) {
            this._recalcPosition();
        }
        if (this.props.activePopupOptions) {
            this._startRepositionPopupTimer();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
        this._stopRepositionPopupTimer();
    }
    render() {
        var popupView = this.props.activePopupOptions.renderPopup(this.state.anchorPosition, this.state.anchorOffset, this.state.constrainedPopupWidth, this.state.constrainedPopupHeight);
        const style = {
            flex: 0,
            top: this.state.popupTop,
            left: this.state.popupLeft,
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            opacity: this.state.isMeasuringPopup ? 0 : 1,
            overflow: 'visible'
        };
        return (React.createElement(RN.View, { style: style, ref: 'popupContainerView' }, popupView));
    }
    _recalcPosition() {
        if (!this._isMounted) {
            return;
        }
        assert.ok(!!this.props.anchorHandle);
        RN.NativeModules.UIManager.measureInWindow(this.props.anchorHandle, (x, y, width, height, pageX, pageY) => {
            if (!this._isMounted) {
                return;
            }
            assert.ok(!!this._viewHandle);
            let anchorRect = {
                left: x, top: y, right: x + width, bottom: y + height,
                width: width, height: height
            };
            RN.NativeModules.UIManager.measureInWindow(this._viewHandle, (x, y, width, height, pageX, pageY) => {
                let popupRect = {
                    left: x, top: y, right: x + width, bottom: y + height,
                    width: width, height: height
                };
                this._recalcPositionFromLayoutData(anchorRect, popupRect);
            });
        });
    }
    _recalcPositionFromLayoutData(anchorRect, popupRect) {
        // If the popup hasn't been rendered yet, skip.
        if (popupRect.width > 0 && popupRect.height > 0) {
            // Make a copy of the old state.
            let newState = _.extend({}, this.state);
            if (this.state.isMeasuringPopup) {
                newState.isMeasuringPopup = false;
                newState.popupWidth = popupRect.width;
                newState.popupHeight = popupRect.height;
            }
            // If the anchor has disappeared, dismiss the popup.
            if (!(anchorRect.width > 0 && anchorRect.height > 0)) {
                this._dismissPopup();
                return;
            }
            // Start by assuming that we'll be unconstrained.
            newState.constrainedPopupHeight = newState.popupHeight;
            newState.constrainedPopupWidth = newState.popupWidth;
            // Get the width/height of the full window.
            let window = RN.Dimensions.get('window');
            let windowWidth = window.width;
            let windowHeight = window.height;
            // If the anchor is no longer in the window's bounds, cancel the popup.
            if (anchorRect.left >= windowWidth || anchorRect.right <= 0 ||
                anchorRect.bottom <= 0 || anchorRect.top >= windowHeight) {
                this._dismissPopup();
                return;
            }
            let positionsToTry = this.props.activePopupOptions.positionPriorities;
            if (!positionsToTry || positionsToTry.length === 0) {
                positionsToTry = ['bottom', 'right', 'top', 'left'];
            }
            if (this.props.activePopupOptions.useInnerPositioning) {
                // If the popup is meant to be shown inside the anchor we need to recalculate
                // the position differently.
                this._recalcInnerPosition(anchorRect, newState);
                return;
            }
            let foundPerfectFit = false;
            let foundPartialFit = false;
            positionsToTry.forEach(pos => {
                if (!foundPerfectFit) {
                    let absLeft = 0;
                    let absTop = 0;
                    let anchorOffset = 0;
                    let constrainedWidth = 0;
                    let constrainedHeight = 0;
                    switch (pos) {
                        case 'bottom':
                            absTop = anchorRect.bottom;
                            absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                            anchorOffset = newState.popupWidth / 2;
                            if (newState.popupHeight <= windowHeight - ALLEY_WIDTH - anchorRect.bottom) {
                                foundPerfectFit = true;
                            }
                            else if (!foundPartialFit) {
                                constrainedHeight = windowHeight - ALLEY_WIDTH - anchorRect.bottom;
                            }
                            break;
                        case 'top':
                            absTop = anchorRect.top - newState.popupHeight;
                            absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                            anchorOffset = newState.popupWidth / 2;
                            if (newState.popupHeight <= anchorRect.top - ALLEY_WIDTH) {
                                foundPerfectFit = true;
                            }
                            else if (!foundPartialFit) {
                                constrainedHeight = anchorRect.top - ALLEY_WIDTH;
                            }
                            break;
                        case 'right':
                            absLeft = anchorRect.right;
                            absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                            anchorOffset = newState.popupHeight / 2;
                            if (newState.popupWidth <= windowWidth - ALLEY_WIDTH - anchorRect.right) {
                                foundPerfectFit = true;
                            }
                            else if (!foundPartialFit) {
                                constrainedWidth = windowWidth - ALLEY_WIDTH - anchorRect.right;
                            }
                            break;
                        case 'left':
                            absLeft = anchorRect.left - newState.popupWidth;
                            absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                            anchorOffset = newState.popupHeight / 2;
                            if (newState.popupWidth <= anchorRect.left - ALLEY_WIDTH) {
                                foundPerfectFit = true;
                            }
                            else if (!foundPartialFit) {
                                constrainedWidth = anchorRect.left - ALLEY_WIDTH;
                            }
                            break;
                    }
                    let effectiveWidth = constrainedWidth || newState.popupWidth;
                    let effectiveHeight = constrainedHeight || newState.popupHeight;
                    // Make sure we're not hanging off the bounds of the window.
                    if (absLeft < ALLEY_WIDTH) {
                        if (pos === 'top' || pos === 'bottom') {
                            anchorOffset -= ALLEY_WIDTH - absLeft;
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absLeft = ALLEY_WIDTH;
                    }
                    else if (absLeft > windowWidth - ALLEY_WIDTH - effectiveWidth) {
                        if (pos === 'top' || pos === 'bottom') {
                            anchorOffset -= (windowWidth - ALLEY_WIDTH - effectiveWidth - absLeft);
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absLeft = windowWidth - ALLEY_WIDTH - effectiveWidth;
                    }
                    if (absTop < ALLEY_WIDTH) {
                        if (pos === 'right' || pos === 'left') {
                            anchorOffset += absTop - ALLEY_WIDTH;
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absTop = ALLEY_WIDTH;
                    }
                    else if (absTop > windowHeight - ALLEY_WIDTH - effectiveHeight) {
                        if (pos === 'right' || pos === 'left') {
                            anchorOffset -= (windowHeight - ALLEY_WIDTH - effectiveHeight - absTop);
                            if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                                foundPerfectFit = false;
                            }
                        }
                        absTop = windowHeight - ALLEY_WIDTH - effectiveHeight;
                    }
                    if (foundPerfectFit || effectiveHeight > 0 || effectiveWidth > 0) {
                        newState.popupTop = absTop;
                        newState.popupLeft = absLeft;
                        newState.anchorOffset = anchorOffset;
                        newState.anchorPosition = pos;
                        newState.constrainedPopupWidth = effectiveWidth;
                        newState.constrainedPopupHeight = effectiveHeight;
                        foundPartialFit = true;
                    }
                }
            });
            if (!_.isEqual(newState, this.state)) {
                this.setState(newState);
            }
        }
    }
    _recalcInnerPosition(anchorRect, newState) {
        // For inner popups we only accept the first position of the priorities since there should always be room for the bubble.
        const pos = this.props.activePopupOptions.positionPriorities[0];
        switch (pos) {
            case 'top':
                newState.popupTop = anchorRect.top + anchorRect.height - newState.constrainedPopupHeight;
                newState.popupLeft = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;
            case 'bottom':
                newState.popupTop = anchorRect.top + newState.constrainedPopupHeight;
                newState.popupLeft = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;
            case 'left':
                newState.popupTop = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupLeft = anchorRect.left + anchorRect.width - newState.constrainedPopupWidth;
                newState.anchorOffset = newState.popupHeight / 2;
                break;
            case 'right':
                newState.popupTop = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupLeft = anchorRect.left;
                newState.anchorOffset = newState.popupHeight / 2;
                break;
        }
        newState.anchorPosition = pos;
        if (!_.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    }
    _dismissPopup() {
        if (this.props.onDismissPopup) {
            this.props.onDismissPopup();
        }
    }
    _startRepositionPopupTimer() {
        this._respositionPopupTimer = setInterval(() => {
            this._recalcPosition();
        }, 1000);
    }
    _stopRepositionPopupTimer() {
        if (this._respositionPopupTimer) {
            clearInterval(this._respositionPopupTimer);
            this._respositionPopupTimer = null;
        }
    }
}
exports.PopupContainerView = PopupContainerView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PopupContainerView;
