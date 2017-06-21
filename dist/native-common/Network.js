/**
* Network.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of network information APIs.
*/
"use strict";
const RN = require("react-native");
const SyncTasks = require("synctasks");
const RX = require("../common/Interfaces");
class Network extends RX.Network {
    constructor() {
        super();
        let onEventOccuredHandler = this._onEventOccured.bind(this);
        RN.NetInfo.isConnected.addEventListener('change', onEventOccuredHandler);
    }
    isConnected() {
        let deferred = SyncTasks.Defer();
        RN.NetInfo.isConnected.fetch().then(isConnected => {
            deferred.resolve(isConnected);
        }).catch(() => {
            deferred.reject('RN.NetInfo.isConnected.fetch() failed');
        });
        return deferred.promise();
    }
    fetchNetworkType() {
        return SyncTasks.fromThenable(RN.NetInfo.fetch().then(networkType => Network._NativeNetworkTypeToDeviceNetworkType(networkType)));
    }
    _onEventOccured(isConnected) {
        this.connectivityChangedEvent.fire(isConnected);
    }
    static _NativeNetworkTypeToDeviceNetworkType(networkType) {
        switch (networkType) {
            case 'UNKNOWN':
                return RX.DeviceNetworkType.UNKNOWN;
            case 'NONE':
                return RX.DeviceNetworkType.NONE;
            case 'WIFI':
                return RX.DeviceNetworkType.WIFI;
            case 'MOBILE_2G':
                return RX.DeviceNetworkType.MOBILE_2G;
            case 'MOBILE_3G':
                return RX.DeviceNetworkType.MOBILE_3G;
            case 'MOBILE_4G':
                return RX.DeviceNetworkType.MOBILE_4G;
        }
        return RX.DeviceNetworkType.UNKNOWN;
    }
}
exports.Network = Network;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Network();
