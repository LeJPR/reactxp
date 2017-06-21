/**
* FocusManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages focusable elements for better keyboard navigation.
*/
import React = require('react');
export declare class FocusManager {
    private static _rootFocusManager;
    private static _restrictionStack;
    private static _currentRestrictionOwner;
    private static _currentFocusedComponent;
    private _prevFocusedComponent;
    private static _allFocusableComponents;
    private _myFocusableComponentIds;
    private _isRoot;
    setAsRootFocusManager(): void;
    addFocusableComponent(component: React.Component<any, any>): void;
    removeFocusableComponent(component: React.Component<any, any>): void;
    restrictFocusWithin(): void;
    release(): void;
    private static _removeFocusRestriction();
    private static _setTabIndex(component, value);
    private static _restrictComponentFocus(componentId);
    private static _removeComponentFocusRestriction(componentId);
}
export declare function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function): void;
export default FocusManager;
