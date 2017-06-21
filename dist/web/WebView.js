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
const ReactDOM = require("react-dom");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const Types = require("../common/Types");
const View_1 = require("./View");
let _styles = {
    webViewDefault: Styles_1.default.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        borderStyle: 'none'
    }),
    webViewContainer: Styles_1.default.createViewStyle({
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'stretch'
    })
};
class WebView extends RX.WebView {
    constructor(props) {
        super(props);
        this._onLoad = (e) => {
            if (this.props.onLoad) {
                this.props.onLoad(e);
            }
        };
        this._sandboxToStringValue = (sandbox) => {
            let values = [];
            if (sandbox & Types.WebViewSandboxMode.AllowForms) {
                values.push('allow-forms');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowModals) {
                values.push('allow-modals');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowOrientationLock) {
                values.push('allow-orientation-lock');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowPointerLock) {
                values.push('allow-pointer-lock');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowPopups) {
                values.push('allow-popups');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowPopupsToEscapeSandbox) {
                values.push('allow-popups-to-escape-sandbox');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowPresentation) {
                values.push('allow-presentation');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowSameOrigin) {
                values.push('allow-same-origin');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowScripts) {
                values.push('allow-scripts');
            }
            if (sandbox & Types.WebViewSandboxMode.AllowTopNavigation) {
                values.push('allow-top-navigation');
            }
            return values.join(' ');
        };
        this.state = {
            postComplete: false,
            webFormIdentifier: `form${WebView._webFrameNumber}`,
            webFrameIdentifier: `frame${WebView._webFrameNumber}`
        };
        WebView._webFrameNumber++;
    }
    componentDidMount() {
        this._postRender();
    }
    componentDidUpdate(prevProps, prevState) {
        this._postRender();
    }
    _postRender() {
        if (!this.state.postComplete) {
            this.setState({
                postComplete: true
            });
        }
    }
    render() {
        let styles = Styles_1.default.combine(_styles.webViewDefault, this.props.style);
        let sandbox = this.props.sandbox !== undefined
            ? this.props.sandbox
            : (this.props.javaScriptEnabled ? Types.WebViewSandboxMode.AllowScripts : Types.WebViewSandboxMode.None);
        // width 100% is needed for Edge - it doesn't grow iframe. Resize needs to be done with wrapper
        return (React.createElement(View_1.View, { style: _styles.webViewContainer },
            React.createElement("iframe", { ref: 'iframe', name: this.state.webFrameIdentifier, id: this.state.webFrameIdentifier, style: styles, src: this.props.url, onLoad: this._onLoad, sandbox: this._sandboxToStringValue(sandbox), width: '100%' })));
    }
    postMessage(message, targetOrigin = '*') {
        const iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.postMessage(message, targetOrigin);
        }
    }
    reload() {
        const iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.location.reload(true);
        }
    }
    goBack() {
        const iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.back();
        }
    }
    goForward() {
        const iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.forward();
        }
    }
}
WebView._webFrameNumber = 1;
exports.WebView = WebView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WebView;
