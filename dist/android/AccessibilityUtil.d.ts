/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific accessibility utils.
*/
import React = require('react');
import { AccessibilityPlatformUtil as CommonAccessibilityNativeUtil } from '../common/AccessibilityUtil';
export declare class AccessibilityUtil extends CommonAccessibilityNativeUtil {
    private _sendAccessibilityEvent(component, eventId);
    setAccessibilityFocus(component: React.Component<any, any>): void;
}
declare var _default: AccessibilityUtil;
export default _default;
