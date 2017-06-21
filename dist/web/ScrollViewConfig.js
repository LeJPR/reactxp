/**
* ScrollViewConfig.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific scroll view configuration, required to avoid circular
* dependency between application and ScrollView.
*/
"use strict";
class ScrollViewConfig {
    constructor() {
        this._useCustomScrollbars = false;
    }
    // Enable native scrollbars for all instances.
    setUseCustomScrollbars(value) {
        this._useCustomScrollbars = value;
    }
    useCustomScrollbars() {
        return this._useCustomScrollbars;
    }
}
exports.ScrollViewConfig = ScrollViewConfig;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new ScrollViewConfig();
