/**
* AppConfig.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple class to store application config.
*/
"use strict";
class AppConfig {
    constructor() {
        this._isDebug = false;
        this._isDevelopment = false;
    }
    setAppConfig(isDebug, isDevelopment) {
        this._isDebug = isDebug;
        this._isDevelopment = isDevelopment;
    }
    isDebugMode() {
        return this._isDebug;
    }
    isDevelopmentMode() {
        return this._isDevelopment;
    }
}
exports.AppConfig = AppConfig;
var instance = new AppConfig();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = instance;
