/**
* Popup.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* React Native implementation of the cross-platform Popup abstraction.
*/
"use strict";
const FrontLayerViewManager_1 = require("./FrontLayerViewManager");
const RX = require("../common/Interfaces");
class Popup extends RX.Popup {
    show(options, popupId, delay) {
        return FrontLayerViewManager_1.default.showPopup(options, popupId, delay);
    }
    autoDismiss(popupId, delay) {
        setTimeout(() => {
            FrontLayerViewManager_1.default.dismissPopup(popupId);
        }, delay || 0);
    }
    dismiss(popupId) {
        FrontLayerViewManager_1.default.dismissPopup(popupId);
    }
    dismissAll() {
        FrontLayerViewManager_1.default.dismissAllPopups();
    }
}
exports.Popup = Popup;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Popup();
