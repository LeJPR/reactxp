/**
* GestureView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation of RN GestureView component.
*/
"use strict";
const GestureView_1 = require("../native-common/GestureView");
const _preferredPanRatio = 3;
class GestureView extends GestureView_1.GestureView {
    constructor(props) {
        super(props);
    }
    _getPreferredPanRatio() {
        return _preferredPanRatio;
    }
    _getEventTimestamp(e) {
        let timestamp = e.timeStamp;
        // Work around a bug in some versions of RN where "timestamp" is
        // capitalized differently for some events.
        if (!timestamp) {
            timestamp = e.timestamp;
        }
        if (!timestamp) {
            return 0;
        }
        return timestamp.valueOf();
    }
}
exports.GestureView = GestureView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GestureView;
