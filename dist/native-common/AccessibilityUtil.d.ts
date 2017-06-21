import React = require('react');
import { AccessibilityUtil as CommonAccessibilityUtil, AccessibilityPlatformUtil } from '../common/AccessibilityUtil';
import Types = require('../common/Types');
export declare class AccessibilityUtil extends CommonAccessibilityUtil {
    private _instance;
    setAccessibilityPlatformUtil(instance: AccessibilityPlatformUtil): void;
    accessibilityTraitToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[], defaultTrait?: Types.AccessibilityTrait): string[];
    accessibilityComponentTypeToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[], defaultTrait?: Types.AccessibilityTrait): string;
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string;
    setAccessibilityFocus(component: React.Component<any, any>): void;
}
declare var _default: AccessibilityUtil;
export default _default;
