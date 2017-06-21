/**
* Platform.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of Platform interface.
*/
"use strict";
const RX = require("../common/Interfaces");
class Platform extends RX.Platform {
    getType() {
        return 'web';
    }
}
exports.Platform = Platform;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Platform();
