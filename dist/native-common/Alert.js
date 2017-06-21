/**
* Alert.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native Alert dialog boxes for ReactXP.
*/
"use strict";
const RN = require("react-native");
// Native implementation for alert dialog boxes
class Alert {
    show(title, message, buttons, icon) {
        RN.Alert.alert(title, message, buttons);
    }
}
exports.Alert = Alert;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Alert();
