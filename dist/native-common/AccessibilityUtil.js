/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of accessiblity functions for cross-platform
* ReactXP framework.
*/
"use strict";
const _ = require("./lodashMini");
const AccessibilityUtil_1 = require("../common/AccessibilityUtil");
const Types = require("../common/Types");
const liveRegionMap = {
    [Types.AccessibilityLiveRegion.None]: 'none',
    [Types.AccessibilityLiveRegion.Assertive]: 'assertive',
    [Types.AccessibilityLiveRegion.Polite]: 'polite'
};
// iOS supported map.
const traitsMap = {
    [Types.AccessibilityTrait.None]: 'none',
    [Types.AccessibilityTrait.Tab]: 'none',
    // label. This needs to be done for any custom role, which needs to be supported on iOS.
    [Types.AccessibilityTrait.Button]: 'button',
    [Types.AccessibilityTrait.Link]: 'link',
    [Types.AccessibilityTrait.Header]: 'header',
    [Types.AccessibilityTrait.Search]: 'search',
    [Types.AccessibilityTrait.Image]: 'image',
    [Types.AccessibilityTrait.Summary]: 'summary',
    [Types.AccessibilityTrait.Adjustable]: 'adjustable',
    [Types.AccessibilityTrait.Selected]: 'selected',
    [Types.AccessibilityTrait.Plays]: 'plays',
    [Types.AccessibilityTrait.Key]: 'key',
    [Types.AccessibilityTrait.Text]: 'text',
    [Types.AccessibilityTrait.Disabled]: 'disabled',
    [Types.AccessibilityTrait.FrequentUpdates]: 'frequentUpdates',
    [Types.AccessibilityTrait.StartsMedia]: 'startsMedia',
    [Types.AccessibilityTrait.AllowsDirectInteraction]: 'allowsDirectionInteraction',
    [Types.AccessibilityTrait.PageTurn]: 'pageTurn'
};
// Android supported map.
const componentTypeMap = {
    [Types.AccessibilityTrait.None]: 'none',
    [Types.AccessibilityTrait.Tab]: 'none',
    // it a custom label. This needs to be done for any custom role, which needs to be supported
    // on Android.
    [Types.AccessibilityTrait.Button]: 'button',
    [Types.AccessibilityTrait.Radio_button_checked]: 'radiobutton_checked',
    [Types.AccessibilityTrait.Radio_button_unchecked]: 'radiobutton_unchecked'
};
class AccessibilityUtil extends AccessibilityUtil_1.AccessibilityUtil {
    setAccessibilityPlatformUtil(instance) {
        this._instance = instance;
    }
    // Converts an AccessibilityTrait to a string, but the returned value is only needed for iOS. Other platforms ignore it. Presence
    // of an AccessibilityTrait.None can make an element non-accessible on Android. We use the override traits if they are present, else
    // use the deafult trait.
    accessibilityTraitToString(overrideTraits, defaultTrait) {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        if (!overrideTraits && !defaultTrait) {
            return [];
        }
        const traits = _.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        return _.compact(_.map(traits, t => traitsMap[t]));
    }
    // Converts an AccessibilityTrait to an accessibilityComponentType string, but the returned value is only needed for Android. Other
    // platforms ignore it.
    accessibilityComponentTypeToString(overrideTraits, defaultTrait) {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        // Max enum value in this array is the componentType for android.
        if (!overrideTraits && !defaultTrait) {
            return undefined;
        }
        const combinedTraits = _.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        return componentTypeMap[_.max(_.filter(combinedTraits, t => componentTypeMap.hasOwnProperty(t)))];
    }
    // Converts an AccessibilityLiveRegion to a string, but the return value is only needed for Android. Other platforms ignore it.
    accessibilityLiveRegionToString(liveRegion) {
        if (liveRegionMap[liveRegion]) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    }
    // Platform specific accessibility APIs. 
    setAccessibilityFocus(component) {
        this._instance.setAccessibilityFocus(component);
    }
}
exports.AccessibilityUtil = AccessibilityUtil;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new AccessibilityUtil();
