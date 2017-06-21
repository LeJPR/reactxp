/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific accessibility utils.
*/
"use strict";
const AccessibilityUtil_1 = require("../common/AccessibilityUtil");
class AccessibilityUtil extends AccessibilityUtil_1.AccessibilityPlatformUtil {
    setAccessibilityFocus(component) {
        // No-Op
    }
}
exports.AccessibilityUtil = AccessibilityUtil;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new AccessibilityUtil();
