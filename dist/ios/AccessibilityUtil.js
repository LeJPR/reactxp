/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific accessibility utils.
*/
"use strict";
const RN = require("react-native");
const Accessibility_1 = require("../native-common/Accessibility");
const AccessibilityUtil_1 = require("../common/AccessibilityUtil");
class AccessibilityUtil extends AccessibilityUtil_1.AccessibilityPlatformUtil {
    setAccessibilityFocus(component) {
        if (Accessibility_1.default.isScreenReaderEnabled() && RN.AccessibilityInfo && RN.AccessibilityInfo.setAccessibilityFocus) {
            RN.AccessibilityInfo.setAccessibilityFocus(RN.findNodeHandle(component));
        }
    }
}
exports.AccessibilityUtil = AccessibilityUtil;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new AccessibilityUtil();
