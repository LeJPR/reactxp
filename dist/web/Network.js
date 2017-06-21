/**
* Network.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of Network information APIs.
*/
"use strict";
const SyncTasks = require("synctasks");
const RX = require("../common/Interfaces");
class Network extends RX.Network {
    constructor() {
        super();
        let onEventOccuredHandler = this._onEventOccured.bind(this);
        // Avoid accessing window if it's not defined (for test environment).
        if (typeof (window) !== 'undefined') {
            window.addEventListener('online', onEventOccuredHandler);
            window.addEventListener('offline', onEventOccuredHandler);
        }
    }
    isConnected() {
        return SyncTasks.Resolved(navigator.onLine);
    }
    fetchNetworkType() {
        return SyncTasks.Resolved(RX.DeviceNetworkType.UNKNOWN);
    }
    _onEventOccured() {
        this.connectivityChangedEvent.fire(navigator.onLine);
    }
}
exports.Network = Network;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Network();
