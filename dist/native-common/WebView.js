/**
* WebView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A control that allows the display of an independent web page.
*/
"use strict";
const React = require("react");
const RN = require("react-native");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const _styles = {
    webViewDefault: Styles_1.default.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    })
};
const WEBVIEW_REF = 'webview';
class WebView extends RX.WebView {
    render() {
        let styles = Styles_1.default.combine(_styles.webViewDefault, this.props.style);
        return (React.createElement(RN.WebView, { ref: WEBVIEW_REF, style: styles, onNavigationStateChange: this.props.onNavigationStateChange, onShouldStartLoadWithRequest: this.props.onShouldStartLoadWithRequest, source: { uri: this.props.url, headers: this.props.headers }, onLoad: this.props.onLoad, startInLoadingState: this.props.startInLoadingState, javaScriptEnabled: this.props.javaScriptEnabled, injectedJavaScript: this.props.injectedJavaScript, domStorageEnabled: this.props.domStorageEnabled, scalesPageToFit: this.props.scalesPageToFit, onError: this.props.onError, onLoadStart: this.props.onLoadStart }));
    }
    reload() {
        const webView = this.refs[WEBVIEW_REF];
        if (webView) {
            webView.reload();
        }
    }
    goBack() {
        const webView = this.refs[WEBVIEW_REF];
        if (webView) {
            webView.goBack();
        }
    }
    goForward() {
        const webView = this.refs[WEBVIEW_REF];
        if (webView) {
            webView.goForward();
        }
    }
}
exports.WebView = WebView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WebView;
