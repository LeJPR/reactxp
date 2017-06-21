/**
* Clipboard.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Clipboard abstraction.
*/
"use strict";
const RN = require("react-native");
const RX = require("../common/Interfaces");
const SyncTasks = require("synctasks");
class Clipboard extends RX.Clipboard {
    setText(text) {
        RN.Clipboard.setString(text);
    }
    getText() {
        let defer = SyncTasks.Defer();
        return SyncTasks.fromThenable(RN.Clipboard.getString());
    }
}
exports.Clipboard = Clipboard;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Clipboard();
