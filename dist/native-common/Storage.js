/**
* Storage.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of the cross-platform database storage abstraction.
*/
"use strict";
const RN = require("react-native");
const SyncTasks = require("synctasks");
const RX = require("../common/Interfaces");
class Storage extends RX.Storage {
    getItem(key) {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.getItem(key, (error, result) => {
            if (!error) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }
    setItem(key, value) {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.setItem(key, value, (error) => {
            if (!error) {
                deferred.resolve();
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }
    removeItem(key) {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.removeItem(key, (error) => {
            if (!error) {
                deferred.resolve();
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }
    clear() {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.clear((error) => {
            if (!error) {
                deferred.resolve();
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }
}
exports.Storage = Storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Storage();
