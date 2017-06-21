/**
* Input.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of Input interface.
*/
"use strict";
const RN = require("react-native");
const RX = require("../common/Interfaces");
class Input extends RX.Input {
    constructor() {
        super();
        RN.BackAndroid.addEventListener('BackButton', () => {
            return this.backButtonEvent.fire();
        });
    }
}
exports.Input = Input;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Input();
