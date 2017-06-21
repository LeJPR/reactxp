/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.).
*/
"use strict";
const ReactDOM = require("react-dom");
const ScrollViewConfig_1 = require("./ScrollViewConfig");
const SyncTasks = require("synctasks");
const FrontLayerViewManager_1 = require("./FrontLayerViewManager");
const RX = require("../common/Interfaces");
class UserInterface extends RX.UserInterface {
    measureLayoutRelativeToWindow(component) {
        let deferred = SyncTasks.Defer();
        const componentDomNode = ReactDOM.findDOMNode(component);
        if (!componentDomNode) {
            deferred.reject('measureLayoutRelativeToWindow failed');
        }
        else {
            const componentBoundingRect = componentDomNode.getBoundingClientRect();
            deferred.resolve({
                x: componentBoundingRect.left,
                y: componentBoundingRect.top,
                width: componentBoundingRect.width,
                height: componentBoundingRect.height
            });
        }
        return deferred.promise();
    }
    measureLayoutRelativeToAncestor(component, ancestor) {
        let deferred = SyncTasks.Defer();
        const componentDomNode = ReactDOM.findDOMNode(component);
        const ancestorDomNode = ReactDOM.findDOMNode(ancestor);
        if (!componentDomNode || !ancestorDomNode) {
            deferred.reject('measureLayoutRelativeToAncestor failed');
        }
        else {
            const componentBoundingRect = componentDomNode.getBoundingClientRect();
            const ancestorBoundingRect = ancestorDomNode.getBoundingClientRect();
            deferred.resolve({
                x: componentBoundingRect.left - ancestorBoundingRect.left,
                y: componentBoundingRect.top - ancestorBoundingRect.top,
                width: componentBoundingRect.width,
                height: componentBoundingRect.height
            });
        }
        return deferred.promise();
    }
    measureWindow() {
        return {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    getContentSizeMultiplier() {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        return SyncTasks.Resolved(1);
    }
    getMaxContentSizeMultiplier() {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        return SyncTasks.Resolved(0);
    }
    setMaxContentSizeMultiplier(maxContentSizeMultiplier) {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        // No-op.
    }
    isHighPixelDensityScreen() {
        return this.getPixelRatio() > 1;
    }
    getPixelRatio() {
        var pixelRatio = 0;
        if (window.devicePixelRatio) {
            pixelRatio = window.devicePixelRatio;
        }
        return pixelRatio;
    }
    setMainView(element) {
        FrontLayerViewManager_1.default.setMainView(element);
    }
    setHOC(element) {
        FrontLayerViewManager_1.default.setHOC(element);
    }
    useCustomScrollbars(enable = true) {
        ScrollViewConfig_1.default.setUseCustomScrollbars(enable);
    }
    dismissKeyboard() {
        // Nothing to do
    }
}
exports.UserInterface = UserInterface;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new UserInterface();
