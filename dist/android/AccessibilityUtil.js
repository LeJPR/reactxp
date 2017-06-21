/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific accessibility utils.
*/
"use strict";
const RN = require("react-native");
const Accessibility_1 = require("../native-common/Accessibility");
const AccessibilityUtil_1 = require("../common/AccessibilityUtil");
class AccessibilityUtil extends AccessibilityUtil_1.AccessibilityPlatformUtil {
    _sendAccessibilityEvent(component, eventId) {
        // See list of events here:
        // https://developer.android.com/reference/android/view/accessibility/AccessibilityEvent.html
        // For some reason, a small delay is required for the event to be properly processed.
        setTimeout(() => {
            RN.NativeModules.UIManager.sendAccessibilityEvent(RN.findNodeHandle(component), eventId);
        }, 100);
    }
    setAccessibilityFocus(component) {
        const TYPE_VIEW_FOCUSED = 8;
        if (Accessibility_1.default.isScreenReaderEnabled()) {
            this._sendAccessibilityEvent(component, TYPE_VIEW_FOCUSED);
        }
    }
}
exports.AccessibilityUtil = AccessibilityUtil;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new AccessibilityUtil();
