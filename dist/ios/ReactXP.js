/**
* ReactXP.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Wrapper for all ReactXP functionality. Users of ReactXP should import just this
* file instead of internals.
*/
"use strict";
const React = require("react");
const RXInterface = require("../common/Interfaces");
const RXTypes = require("../common/Types");
const AnimatedImpl = require("../native-common/Animated");
// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.
const Accessibility_1 = require("./Accessibility");
const ActivityIndicator_1 = require("../native-common/ActivityIndicator");
const Alert_1 = require("../native-common/Alert");
const App_1 = require("../native-common/App");
const Button_1 = require("../native-common/Button");
const Picker_1 = require("../native-common/Picker");
const Image_1 = require("../native-common/Image");
const Input_1 = require("../native-common/Input");
const Clipboard_1 = require("../native-common/Clipboard");
const GestureView_1 = require("./GestureView");
const International_1 = require("../native-common/International");
const Link_1 = require("../native-common/Link");
const Linking_1 = require("./Linking");
const Location_1 = require("../common/Location");
const Modal_1 = require("../native-common/Modal");
const Navigator_1 = require("../native-common/Navigator");
const Network_1 = require("../native-common/Network");
const Platform_1 = require("../native-common/Platform");
const Popup_1 = require("../native-common/Popup");
const ScrollView_1 = require("../native-common/ScrollView");
const StatusBar_1 = require("./StatusBar");
const Storage_1 = require("../native-common/Storage");
const Styles_1 = require("../native-common/Styles");
const Text_1 = require("../native-common/Text");
const TextInput_1 = require("../native-common/TextInput");
const UserInterface_1 = require("../native-common/UserInterface");
const UserPresence_1 = require("../native-common/UserPresence");
const View_1 = require("../native-common/View");
const WebView_1 = require("../native-common/WebView");
const ViewBase_1 = require("../native-common/ViewBase");
// Initialize the iOS default view style. This is required because on RN for iOS, the default
// overflow is 'visible', but we want it to be 'hidden' (the default for ReactXP and RN Android).
const _defaultViewStyle = Styles_1.default.createViewStyle({
    overflow: 'hidden'
});
ViewBase_1.default.setDefaultViewStyle(_defaultViewStyle);
// Initialize iOS implementation of platform accessibility helpers inside the singleton
// instance of native-common AccessibilityUtil. This is to let native-common components access
// platform specific APIs through native-common implementation itself. 
const AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
const AccessibilityUtil_2 = require("./AccessibilityUtil");
AccessibilityUtil_1.default.setAccessibilityPlatformUtil(AccessibilityUtil_2.default);
// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.
var ReactXP;
(function (ReactXP) {
    ReactXP.Accessibility = Accessibility_1.default;
    ReactXP.Animated = AnimatedImpl.Animated;
    ReactXP.ActivityIndicator = ActivityIndicator_1.ActivityIndicator;
    ReactXP.Alert = Alert_1.default;
    ReactXP.App = App_1.default;
    ReactXP.Button = Button_1.default;
    ReactXP.Picker = Picker_1.default;
    ReactXP.Clipboard = Clipboard_1.default;
    ReactXP.GestureView = GestureView_1.default;
    ReactXP.Image = Image_1.default;
    ReactXP.Input = Input_1.default;
    ReactXP.International = International_1.default;
    ReactXP.Link = Link_1.default;
    ReactXP.Linking = Linking_1.default;
    ReactXP.Location = Location_1.default;
    ReactXP.Modal = Modal_1.default;
    ReactXP.Navigator = Navigator_1.default;
    ReactXP.Network = Network_1.default;
    ReactXP.Platform = Platform_1.default;
    ReactXP.Popup = Popup_1.default;
    ReactXP.ScrollView = ScrollView_1.default;
    ReactXP.StatusBar = StatusBar_1.default;
    ReactXP.Storage = Storage_1.default;
    ReactXP.Styles = Styles_1.default;
    ReactXP.Text = Text_1.default;
    ReactXP.TextInput = TextInput_1.default;
    ReactXP.UserInterface = UserInterface_1.default;
    ReactXP.UserPresence = UserPresence_1.default;
    ReactXP.View = View_1.default;
    ReactXP.WebView = WebView_1.default;
    ReactXP.Types = RXTypes;
    ReactXP.Component = React.Component;
    ReactXP.createElement = React.createElement;
    ReactXP.Children = React.Children;
    ReactXP.__spread = React.__spread;
    ReactXP.DeviceNetworkType = RXInterface.DeviceNetworkType;
})(ReactXP || (ReactXP = {}));
// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.
/* tslint:disable:no-unused-variable */
var _rxImplementsRxInterface = ReactXP;
module.exports = ReactXP;
/* tslint:enable:no-unused-variable */
/*
var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
