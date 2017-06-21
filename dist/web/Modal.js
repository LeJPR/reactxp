/**
* Modal.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Modal abstraction.
*/
"use strict";
const FrontLayerViewManager_1 = require("./FrontLayerViewManager");
const RX = require("../common/Interfaces");
class Modal extends RX.Modal {
    isDisplayed(modalId) {
        return FrontLayerViewManager_1.default.isModalDisplayed(modalId);
    }
    show(modal, modalId) {
        FrontLayerViewManager_1.default.showModal(modal, modalId);
    }
    dismiss(modalId) {
        FrontLayerViewManager_1.default.dismissModal(modalId);
    }
    dismissAll() {
        FrontLayerViewManager_1.default.dismissAllModals();
    }
}
exports.Modal = Modal;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Modal();
