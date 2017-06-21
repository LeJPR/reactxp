/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific implementation for deep linking.
*/
"use strict";
const Linking_1 = require("../native-common/Linking");
class Linking extends Linking_1.Linking {
    // Escaped SMS uri - sms:<phoneNumber>&body=<messageString>
    _createSmsUrl(smsInfo) {
        let smsUrl = 'sms:';
        if (smsInfo.phoneNumber) {
            smsUrl += encodeURI(smsInfo.phoneNumber);
        }
        if (smsInfo.body) {
            // iOS uses the & delimiter instead of the regular ?.
            smsUrl += '&body=' + encodeURIComponent(smsInfo.body);
        }
        return smsUrl;
    }
}
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
