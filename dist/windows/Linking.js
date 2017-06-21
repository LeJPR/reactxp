/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation for deep linking.
*/
"use strict";
const SyncTasks = require("synctasks");
const Linking_1 = require("../common/Linking");
class Linking extends Linking_1.Linking {
    _openUrl(url) {
        // TODO: #694142 Not implemented
        throw 'Not implemented';
        // return SyncTasks.Resolved<boolean>(false);
    }
    getInitialUrl() {
        // TODO: #694142 Not implemented
        return SyncTasks.Resolved(null);
    }
}
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
