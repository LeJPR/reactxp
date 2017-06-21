/**
* MainViewStore.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple store that publishes changes to the main element
* provided by the app.
*/
"use strict";
const SubscribableEvent = require("../common/SubscribableEvent");
class MainViewStore extends SubscribableEvent.SubscribableEvent {
    constructor() {
        super(...arguments);
        this._mainView = null;
    }
    getMainView() {
        return this._mainView;
    }
    setMainView(view) {
        this._mainView = view;
        this.fire();
    }
}
exports.MainViewStore = MainViewStore;
var instance = new MainViewStore();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = instance;
