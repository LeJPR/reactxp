/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common accessibility interface for platform-specific accessibility utilities.
*/
"use strict";
const Types = require("../common/Types");
exports.ImportantForAccessibilityMap = {
    [Types.ImportantForAccessibility.Auto]: 'auto',
    [Types.ImportantForAccessibility.Yes]: 'yes',
    [Types.ImportantForAccessibility.No]: 'no',
    [Types.ImportantForAccessibility.NoHideDescendants]: 'no-hide-descendants'
};
// Platform specific helpers exposed through Native-Common AccessibilityUtil. 
class AccessibilityPlatformUtil {
}
exports.AccessibilityPlatformUtil = AccessibilityPlatformUtil;
class AccessibilityUtil {
    isHidden(importantForAccessibility) {
        if (importantForAccessibility) {
            const importantForAccessibilityString = this.importantForAccessibilityToString(importantForAccessibility);
            return importantForAccessibilityString === exports.ImportantForAccessibilityMap[Types.ImportantForAccessibility.NoHideDescendants];
        }
        return undefined;
    }
    importantForAccessibilityToString(importantForAccessibility, defaultImportantForAccessibility) {
        importantForAccessibility = importantForAccessibility || defaultImportantForAccessibility;
        if (exports.ImportantForAccessibilityMap[importantForAccessibility]) {
            return exports.ImportantForAccessibilityMap[importantForAccessibility];
        }
        return undefined;
    }
}
exports.AccessibilityUtil = AccessibilityUtil;
