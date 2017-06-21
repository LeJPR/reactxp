/**
* Storage.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform database storage abstraction.
*/
"use strict";
const SyncTasks = require("synctasks");
const RX = require("../common/Interfaces");
class Storage extends RX.Storage {
    getItem(key) {
        var value = window.localStorage.getItem(key);
        return SyncTasks.Resolved(value);
    }
    setItem(key, value) {
        window.localStorage.setItem(key, value);
        return SyncTasks.Resolved();
    }
    removeItem(key) {
        window.localStorage.removeItem(key);
        return SyncTasks.Resolved();
    }
    clear() {
        window.localStorage.clear();
        return SyncTasks.Resolved();
    }
}
exports.Storage = Storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Storage();
