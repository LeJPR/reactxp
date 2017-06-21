/**
* MouseResponder.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Handles tracking of mouse movements.
*/
"use strict";
const _ = require("./../utils/lodashMini");
const _compareDOMOrder = (a, b) => {
    if (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
    }
    else {
        return -1;
    }
};
class MouseResponder {
    static create(config) {
        MouseResponder._initializeEventHandlers();
        MouseResponder._responders = MouseResponder._responders || [];
        const responder = {
            id: config.id,
            target: config.target,
            shouldBecomeFirstResponder(event, gestureState) {
                if (!config.shouldBecomeFirstResponder) {
                    return false;
                }
                return config.shouldBecomeFirstResponder(event, gestureState);
            },
            onMove(event, gestureState) {
                if (!config.onMove) {
                    return;
                }
                config.onMove(event, gestureState);
            },
            onTerminate(event, gestureState) {
                if (!config.onTerminate) {
                    return;
                }
                config.onTerminate(event, gestureState);
            }
        };
        MouseResponder._responders.push(responder);
        return {
            dispose() {
                _.remove(MouseResponder._responders, (r) => { return r.id === responder.id; });
                if (MouseResponder._responders.length === 0) {
                    MouseResponder._removeEventHandlers();
                }
            }
        };
    }
    static _initializeEventHandlers() {
        if (MouseResponder._initialized) {
            return;
        }
        window.addEventListener('mousedown', MouseResponder._onMouseDown);
        window.addEventListener('mousemove', MouseResponder._onMouseMove);
        window.addEventListener('mouseup', MouseResponder._onMouseUp);
        MouseResponder._initialized = true;
    }
    static _removeEventHandlers() {
        if (!MouseResponder._initialized) {
            return;
        }
        window.removeEventListener('mousedown', MouseResponder._onMouseDown);
        window.removeEventListener('mousemove', MouseResponder._onMouseMove);
        window.removeEventListener('mouseup', MouseResponder._onMouseUp);
        MouseResponder._initialized = false;
    }
}
MouseResponder._currentResponder = null;
MouseResponder._pendingGestureState = null;
MouseResponder._initialized = false;
MouseResponder._onMouseDown = (event) => {
    // We need to skip new gesture starts when there is already on in progress
    if (MouseResponder._currentResponder) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    MouseResponder._pendingGestureState = {
        initialClientX: event.clientX,
        initialClientY: event.clientY,
        initialPageX: event.pageX,
        initialPageY: event.pageY,
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        velocityX: 0,
        velocityY: 0,
        timeStamp: new Date(),
        isComplete: false
    };
    // We must sort them properly to be consistent with native PanResponder picks it's first responders
    // In native there is no z-index and PanResponder picks always the last registered element.
    // in case of native, that's last element in "DOM"
    MouseResponder._responders.sort(_compareDOMOrder);
    // We need to pick a responder that will handle this GestureView
    const firstResponder = _.findLast(MouseResponder._responders, (responder) => {
        return responder.shouldBecomeFirstResponder(event, MouseResponder._pendingGestureState);
    });
    if (firstResponder) {
        MouseResponder._currentResponder = firstResponder;
    }
};
MouseResponder._onMouseMove = (event) => {
    if (MouseResponder._currentResponder && MouseResponder._pendingGestureState) {
        const { velocityX, velocityY } = MouseResponder._calcVelocity(event, MouseResponder._pendingGestureState);
        MouseResponder._pendingGestureState = _.merge({}, MouseResponder._pendingGestureState, {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            velocityX,
            velocityY,
            isComplete: false
        });
        if (event.buttons === 0) {
            MouseResponder._onMouseUp(event);
        }
        else {
            MouseResponder._currentResponder.onMove(event, MouseResponder._pendingGestureState);
        }
    }
};
MouseResponder._onMouseUp = (event) => {
    // We check whether there is still some buttom pressed
    // in case there are still some buttons left,
    // we don't stop terminate the gesture.
    if (event.buttons !== 0) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    if (MouseResponder._currentResponder && MouseResponder._pendingGestureState) {
        const { velocityX, velocityY } = MouseResponder._calcVelocity(event, MouseResponder._pendingGestureState);
        MouseResponder._pendingGestureState = _.merge({}, MouseResponder._pendingGestureState, {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            velocityX,
            velocityY,
            isComplete: true
        });
        MouseResponder._currentResponder.onTerminate(event, MouseResponder._pendingGestureState);
        MouseResponder._currentResponder = null;
        MouseResponder._pendingGestureState = null;
    }
};
MouseResponder._calcVelocity = (e, gestureState) => {
    const time = Date.now() - gestureState.timeStamp.getTime();
    const velocityX = (e.clientX - gestureState.initialClientX) / time;
    const velocityY = (e.clientY - gestureState.initialClientY) / time;
    return {
        velocityX,
        velocityY
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MouseResponder;
