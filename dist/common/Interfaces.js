/**
* Interfaces.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Defines the template for the ReactXP interface that needs to be
* implemented for each platform.
*/
"use strict";
const React = require("react");
const AppConfig_1 = require("./AppConfig");
const SubscribableEvent = require("./SubscribableEvent");
const Types = require("./Types");
exports.Types = Types;
class ActivityIndicator extends React.Component {
}
exports.ActivityIndicator = ActivityIndicator;
class Alert {
}
exports.Alert = Alert;
class AnimatedComponent extends React.Component {
}
exports.AnimatedComponent = AnimatedComponent;
class AnimatedImage extends AnimatedComponent {
}
exports.AnimatedImage = AnimatedImage;
class AnimatedText extends AnimatedComponent {
}
exports.AnimatedText = AnimatedText;
class AnimatedTextInput extends AnimatedComponent {
}
exports.AnimatedTextInput = AnimatedTextInput;
class AnimatedView extends AnimatedComponent {
}
exports.AnimatedView = AnimatedView;
class AnimatedValue {
    constructor(val) {
        // No-op
    }
}
exports.AnimatedValue = AnimatedValue;
class App {
    constructor() {
        this.activationStateChangedEvent = new SubscribableEvent.SubscribableEvent();
        // Memory Warnings
        this.memoryWarningEvent = new SubscribableEvent.SubscribableEvent();
    }
    // Initialization
    initialize(debug, development) {
        AppConfig_1.default.setAppConfig(debug, development);
    }
}
exports.App = App;
class UserInterface {
    constructor() {
        this.contentSizeMultiplierChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
}
exports.UserInterface = UserInterface;
class Modal {
}
exports.Modal = Modal;
class Popup {
}
exports.Popup = Popup;
class Linking {
    constructor() {
        this.deepLinkRequestEvent = new SubscribableEvent.SubscribableEvent();
    }
}
exports.Linking = Linking;
class Accessibility {
    constructor() {
        this.screenReaderChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
}
exports.Accessibility = Accessibility;
class Button extends React.Component {
}
exports.Button = Button;
class Picker extends React.Component {
}
exports.Picker = Picker;
class Component extends React.Component {
}
exports.Component = Component;
class Image extends React.Component {
}
exports.Image = Image;
class Clipboard {
}
exports.Clipboard = Clipboard;
class Link extends React.Component {
}
exports.Link = Link;
class Storage {
}
exports.Storage = Storage;
class Location {
}
exports.Location = Location;
class Navigator extends React.Component {
}
exports.Navigator = Navigator;
var DeviceNetworkType;
(function (DeviceNetworkType) {
    DeviceNetworkType[DeviceNetworkType["UNKNOWN"] = 0] = "UNKNOWN";
    DeviceNetworkType[DeviceNetworkType["NONE"] = 1] = "NONE";
    DeviceNetworkType[DeviceNetworkType["WIFI"] = 2] = "WIFI";
    DeviceNetworkType[DeviceNetworkType["MOBILE_2G"] = 3] = "MOBILE_2G";
    DeviceNetworkType[DeviceNetworkType["MOBILE_3G"] = 4] = "MOBILE_3G";
    DeviceNetworkType[DeviceNetworkType["MOBILE_4G"] = 5] = "MOBILE_4G";
})(DeviceNetworkType = exports.DeviceNetworkType || (exports.DeviceNetworkType = {}));
class Network {
    constructor() {
        this.connectivityChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
}
exports.Network = Network;
class Platform {
}
exports.Platform = Platform;
class Input {
    constructor() {
        this.backButtonEvent = new SubscribableEvent.SubscribableEvent();
        this.keyDownEvent = new SubscribableEvent.SubscribableEvent();
        this.keyUpEvent = new SubscribableEvent.SubscribableEvent();
    }
}
exports.Input = Input;
class ScrollView extends React.Component {
}
exports.ScrollView = ScrollView;
class StatusBar {
}
exports.StatusBar = StatusBar;
class Styles {
}
exports.Styles = Styles;
class Text extends React.Component {
}
exports.Text = Text;
class TextInput extends React.Component {
}
exports.TextInput = TextInput;
class UserPresence {
    constructor() {
        this.userPresenceChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
}
exports.UserPresence = UserPresence;
class ViewBase extends React.Component {
}
exports.ViewBase = ViewBase;
class View extends ViewBase {
}
exports.View = View;
class GestureView extends ViewBase {
}
exports.GestureView = GestureView;
class WebView extends ViewBase {
}
exports.WebView = WebView;
