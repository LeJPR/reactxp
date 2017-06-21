/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Image abstraction.
*/
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const RN = require("react-native");
const SyncTasks = require("synctasks");
const _ = require("./lodashMini");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const _styles = {
    defaultImage: Styles_1.default.createImageStyle({
        flex: 0,
        overflow: 'hidden',
        width: undefined,
        height: undefined
    })
};
class Image extends RX.Image {
    constructor() {
        super(...arguments);
        this._isMounted = false;
        this._onLoad = (e) => {
            if (!this._isMounted) {
                return;
            }
            let nativeEvent = e.nativeEvent;
            if (nativeEvent) {
                // TODO: #727561 Remove conditional after UWP includes width and height
                //   with image load event.
                if (RN.Platform.OS === 'windows') {
                    this._nativeImageWidth = 0;
                    this._nativeImageHeight = 0;
                }
                else {
                    this._nativeImageWidth = nativeEvent.source.width;
                    this._nativeImageHeight = nativeEvent.source.height;
                }
            }
            if (this.props.onLoad) {
                this.props.onLoad({ width: this._nativeImageWidth, height: this._nativeImageHeight });
            }
        };
        this._onError = (e) => {
            if (!this._isMounted) {
                return;
            }
            if (this.props.onError) {
                const event = e.nativeEvent;
                this.props.onError(new Error(event.error));
            }
        };
    }
    static prefetch(url) {
        const defer = SyncTasks.Defer();
        // TODO: #694125 Remove conditional after RN UWP supports prefetch
        //   https://github.com/ReactWindows/react-native-windows/issues/366
        if (RN.Platform.OS !== 'windows') {
            RN.Image.prefetch(url).then(value => {
                defer.resolve(value);
            }).catch(error => {
                defer.reject(error);
            });
        }
        return defer.promise();
    }
    _getAdditionalProps() {
        return {};
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        // Check if require'd image resource
        let imageSource;
        if (_.isNumber(this.props.source)) {
            // Cast to any since the inbound types mismatch a bit for RN
            imageSource = this.props.source;
        }
        else {
            const imageSourceReq = { uri: this.props.source };
            if (this.props.headers) {
                imageSourceReq.headers = this.props.headers;
            }
            imageSource = imageSourceReq;
        }
        // Use the width/height provided in the style if it's not provided in the image itself.
        let resizeMode = 'contain';
        if (this.props.resizeMode !== undefined &&
            (this.props.resizeMode === 'contain' ||
                this.props.resizeMode === 'cover' ||
                this.props.resizeMode === 'stretch')) {
            resizeMode = this.props.resizeMode;
        }
        const additionalProps = this._getAdditionalProps();
        return (React.createElement(RN.Image, __assign({ ref: 'nativeImage', style: this.getStyles(), source: imageSource, resizeMode: resizeMode, resizeMethod: this.props.resizeMethod, accessibilityLabel: this.props.accessibilityLabel, onLoad: this.props.onLoad ? this._onLoad : null, onError: this._onError, shouldRasterizeIOS: this.props.shouldRasterizeIOS }, additionalProps), this.props.children));
    }
    setNativeProps(nativeProps) {
        this.refs['nativeImage'].setNativeProps(nativeProps);
    }
    getStyles() {
        return Styles_1.default.combine(_styles.defaultImage, this.props.style);
    }
    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    getNativeWidth() {
        return this._nativeImageWidth;
    }
    getNativeHeight() {
        return this._nativeImageHeight;
    }
}
exports.Image = Image;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Image;
