/**
* SubscribableEvent.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple strongly-typed pub/sub/fire eventing system.
*/
"use strict";
const _ = require("./lodashMini");
class SubscriptionToken {
    constructor(_event, _callback) {
        this._event = _event;
        this._callback = _callback;
    }
    unsubscribe() {
        this._event.unsubscribe(this._callback);
    }
}
exports.SubscriptionToken = SubscriptionToken;
class SubscribableEvent {
    constructor() {
        this.fire = ((...args) => {
            // Clone the array so original can be modified by handlers.
            const subs = _.clone(this._subscribers);
            // Execute handlers in the reverse order in which they
            // were registered.
            for (let i = subs.length - 1; i >= 0; i--) {
                if (subs[i].apply(null, args)) {
                    // If the value was handled, early out.
                    return true;
                }
            }
            return false;
        });
        this._subscribers = [];
    }
    dispose() {
        this._subscribers = [];
    }
    subscribe(callback) {
        this._subscribers.push(callback);
        return new SubscriptionToken(this, callback);
    }
    unsubscribe(callback) {
        _.pull(this._subscribers, callback);
    }
}
exports.SubscribableEvent = SubscribableEvent;
