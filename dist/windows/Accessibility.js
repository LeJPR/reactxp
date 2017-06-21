/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web wrapper for subscribing or querying the current state of the
* screen reader.
*/
"use strict";
const Accessibility_1 = require("../common/Accessibility");
class Accessibility extends Accessibility_1.Accessibility {
    // Calling this API on web has no effect.
    isScreenReaderEnabled() {
        return false;
    }
}
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Accessibility();
