/**
* UserPresence.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of the RX interfaces related to
* user presence.
*/
"use strict";
const RX = require("../common/Interfaces");
class UserPresence extends RX.UserPresence {
    // On native platforms, assume that the user is present
    // whenever the app is running.
    isUserPresent() {
        return true;
    }
}
exports.UserPresence = UserPresence;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new UserPresence();
