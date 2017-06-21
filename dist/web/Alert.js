/**
* Alert.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web Alert dialog boxes.
*/
"use strict";
const RX = require("../common/Interfaces");
// Web/HTML implementation for alert dialog boxes
class Alert extends RX.Alert {
    show(title, message, buttons, icon) {
        if ('Notification' in window) {
            // There is no <button> and <type> support for Web/HTML notifications!
            let options = { body: message, icon };
            // Permission check / request is needed to support browsers with an opt-in notificiaton permission model
            if (Notification.permission === 'granted') {
                /* tslint:disable:no-unused-variable */
                // new instance of Notification needs to be created but not used
                let htmlNotification = new Notification(title, options);
            }
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission((permission) => {
                    if (permission === 'granted') {
                        /* tslint:disable:no-unused-variable */
                        // new instance of Notification needs to be created but not used
                        let htmlNotification = new Notification(title, options);
                    }
                });
            }
        }
        else {
            // Fallback to traditional js alert() if Notification isn't supported
            alert(`${title}${message !== undefined && message !== null && message.length > 0 ? `: ${message}` : ''}`);
        }
    }
}
exports.Alert = Alert;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Alert();
