/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common wrapper for accessibility helper exposed from ReactXP.
*/
"use strict";
const SubscribableEvent = require("../common/SubscribableEvent");
const RX = require("../common/Interfaces");
class Accessibility extends RX.Accessibility {
    constructor() {
        super(...arguments);
        this.newAnnouncementReadyEvent = new SubscribableEvent.SubscribableEvent();
    }
    announceForAccessibility(announcement) {
        this.newAnnouncementReadyEvent.fire(announcement);
    }
}
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Accessibility;
