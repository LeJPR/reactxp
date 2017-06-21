/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation for deep linking.
*/
"use strict";
const RN = require("react-native");
const SyncTasks = require("synctasks");
const Linking_1 = require("../common/Linking");
const Types = require("../common/Types");
class Linking extends Linking_1.Linking {
    constructor() {
        super();
        RN.Linking.addEventListener('url', (event) => {
            this.deepLinkRequestEvent.fire(event.url);
        });
    }
    _openUrl(url) {
        let defer = SyncTasks.Defer();
        RN.Linking.canOpenURL(url).then(value => {
            if (!value) {
                defer.reject({
                    code: Types.LinkingErrorCode.NoAppFound,
                    url: url,
                    description: 'No app found to handle url: ' + url
                });
            }
            else {
                return RN.Linking.openURL(url);
            }
        }).catch(error => {
            defer.reject({
                code: Types.LinkingErrorCode.UnexpectedFailure,
                url: url,
                description: error
            });
        });
        return defer.promise();
    }
    getInitialUrl() {
        let defer = SyncTasks.Defer();
        RN.Linking.getInitialURL().then(url => {
            defer.resolve(url);
        }).catch(error => {
            defer.reject({
                code: Types.LinkingErrorCode.InitialUrlNotFound,
                url: null,
                description: error
            });
        });
        return defer.promise();
    }
}
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
