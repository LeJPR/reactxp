/**
* International.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation for i18n.
*/
"use strict";
const RN = require("react-native");
class International {
    allowRTL(allow) {
        RN.I18nManager.allowRTL(allow);
    }
    forceRTL(force) {
        RN.I18nManager.forceRTL(force);
    }
    isRTL() {
        return RN.I18nManager.isRTL;
    }
}
exports.International = International;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new International();
