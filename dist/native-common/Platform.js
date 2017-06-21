/**
* Platform.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of Platform interface.
*/
"use strict";
const RN = require("react-native");
const RX = require("../common/Interfaces");
class Platform extends RX.Platform {
    getType() {
        return RN.Platform.OS;
    }
}
exports.Platform = Platform;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Platform();
