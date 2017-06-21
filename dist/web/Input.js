/**
* Input.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web implementation of Input interface.
*/
"use strict";
const RX = require("../common/Interfaces");
class Input extends RX.Input {
    constructor() {
        super();
    }
    dispatchKeyDown(e) {
        this.keyDownEvent.fire(e);
    }
    dispatchKeyUp(e) {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }
}
exports.Input = Input;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Input();
