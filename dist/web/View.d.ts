/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform View abstraction.
*/
import React = require('react');
import Types = require('../common/Types');
import ViewBase from './ViewBase';
import { FocusManager } from './utils/FocusManager';
export interface ViewContext {
    isRxParentAText?: boolean;
    focusManager?: FocusManager;
}
export declare class View extends ViewBase<Types.ViewProps, {}> {
    static contextTypes: React.ValidationMap<any>;
    context: ViewContext;
    static childContextTypes: React.ValidationMap<any>;
    private _focusManager;
    private _resizeDetectorAnimationFrame;
    private _resizeDetectorNodes;
    constructor(props: Types.ViewProps);
    private _renderResizeDetectorIfNeeded(containerStyles);
    private _resizeDetectorReset();
    private _resizeDetectorOnScroll();
    getChildContext(): ViewContext;
    protected _getContainerRef(): React.Component<any, any>;
    render(): React.ReactElement<any>;
    componentWillReceiveProps(nextProps: Types.ViewProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export default View;
