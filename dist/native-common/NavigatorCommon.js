/**
* NavigatorCommon.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common native interfaces for Navigator on mobile.
* We need this class to avoid circular references between Navigator and NavigatorDelegates.
*/
"use strict";
var CommandType;
(function (CommandType) {
    CommandType[CommandType["Push"] = 0] = "Push";
    CommandType[CommandType["Pop"] = 1] = "Pop";
    CommandType[CommandType["Replace"] = 2] = "Replace";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
class NavigatorDelegate {
    constructor(navigator) {
        this.onBackPress = () => {
            const routes = this.getRoutes();
            if (routes.length > 1) {
                this.handleBackPress();
                if (this._owner.props.navigateBackCompleted) {
                    this._owner.props.navigateBackCompleted();
                }
                // Indicate that we handled the event.
                return true;
            }
            return false;
        };
        this._owner = navigator;
    }
}
exports.NavigatorDelegate = NavigatorDelegate;
