/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation for deep linking
*/
"use strict";
const SyncTasks = require("synctasks");
const Types = require("../common/Types");
const Linking_1 = require("../common/Linking");
class Linking extends Linking_1.Linking {
    _openUrl(url) {
        const otherWindow = window.open();
        if (!otherWindow) {
            // window opening was blocked by browser (probably not
            // invoked in direct reaction to user action, like thru
            // promise or setTimeout).
            return SyncTasks.Rejected({
                code: Types.LinkingErrorCode.Blocked,
                url: url,
                description: 'Window was blocked by popup blocker'
            });
        }
        // SECURITY WARNING:
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        // Note: can only set to null, otherwise is readonly.
        // Note: In order for mailto links to work properly window.opener cannot be null.
        if (url.indexOf('mailto:') !== 0) {
            otherWindow.opener = null;
        }
        otherWindow.location.href = url;
        return SyncTasks.Resolved();
    }
    getInitialUrl() {
        return SyncTasks.Resolved(null);
    }
}
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
