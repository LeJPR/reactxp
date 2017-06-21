/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.).
*/
"use strict";
const assert = require("assert");
const RN = require("react-native");
const SyncTasks = require("synctasks");
const MainViewStore_1 = require("./MainViewStore");
const RX = require("../common/Interfaces");
class UserInterface extends RX.UserInterface {
    constructor() {
        super();
        RN.DeviceEventEmitter.addListener('didUpdateContentSizeMultiplier', (newValue) => {
            this.contentSizeMultiplierChangedEvent.fire(newValue);
        });
    }
    measureLayoutRelativeToWindow(component) {
        let deferred = SyncTasks.Defer();
        let nodeHandle = RN.findNodeHandle(component);
        assert.ok(!!nodeHandle);
        RN.NativeModules.UIManager.measureInWindow(nodeHandle, (x, y, width, height, pageX, pageY) => {
            deferred.resolve({
                x: x,
                y: y,
                width: width,
                height: height
            });
        });
        return deferred.promise();
    }
    measureLayoutRelativeToAncestor(component, ancestor) {
        let deferred = SyncTasks.Defer();
        let nodeHandle = RN.findNodeHandle(component);
        let ancestorNodeHander = RN.findNodeHandle(ancestor);
        RN.NativeModules.UIManager.measureLayout(nodeHandle, ancestorNodeHander, () => {
            deferred.reject('UIManager.measureLayout() failed');
        }, (x, y, width, height, pageX, pageY) => {
            deferred.resolve({
                x: x,
                y: y,
                width: width,
                height: height
            });
        });
        return deferred.promise();
    }
    measureWindow() {
        const dimensions = RN.Dimensions.get('window');
        return {
            x: 0,
            y: 0,
            width: dimensions.width,
            height: dimensions.height
        };
    }
    getContentSizeMultiplier() {
        let deferred = SyncTasks.Defer();
        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        if (RN.Platform.OS === 'windows') {
            deferred.resolve(1);
        }
        else {
            RN.NativeModules.UIManager.getContentSizeMultiplier((value) => {
                deferred.resolve(value);
            });
        }
        return deferred.promise();
    }
    getMaxContentSizeMultiplier() {
        let deferred = SyncTasks.Defer();
        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        if (RN.Platform.OS === 'windows') {
            deferred.resolve(1);
        }
        else {
            RN.NativeModules.UIManager.getMaxContentSizeMultiplier((value) => {
                deferred.resolve(value);
            });
        }
        return deferred.promise();
    }
    setMaxContentSizeMultiplier(maxContentSizeMultiplier) {
        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        if (RN.Platform.OS !== 'windows') {
            RN.NativeModules.UIManager.setMaxContentSizeMultiplier(maxContentSizeMultiplier);
        }
    }
    useCustomScrollbars(enable = true) {
        // Nothing to do
    }
    dismissKeyboard() {
        RN.TextInput.State.blurTextInput(RN.TextInput.State.currentlyFocusedField());
    }
    isHighPixelDensityScreen() {
        let ratio = RN.PixelRatio.get();
        let isHighDef = ratio > 1;
        return isHighDef;
    }
    getPixelRatio() {
        return RN.PixelRatio.get();
    }
    setMainView(element) {
        MainViewStore_1.default.setMainView(element);
    }
    renderMainView() {
        // Nothing to do
    }
}
exports.UserInterface = UserInterface;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new UserInterface();
