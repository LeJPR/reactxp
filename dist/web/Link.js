/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Link abstraction.
*/
"use strict";
const React = require("react");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const FocusManager_1 = require("./utils/FocusManager");
const _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};
const _longPressTime = 1000;
class Link extends RX.Link {
    constructor() {
        super(...arguments);
        this._onClick = (e) => {
            e.stopPropagation();
            if (this.props.onPress) {
                e.preventDefault();
                this.props.onPress(e, this.props.url);
            }
        };
        this._onMouseDown = (e) => {
            if (this.props.onLongPress) {
                e.persist();
                this._longPressTimer = window.setTimeout(() => {
                    this._longPressTimer = undefined;
                    if (this.props.onLongPress) {
                        this.props.onLongPress(e, this.props.url);
                    }
                }, _longPressTime);
            }
        };
        this._onMouseUp = (e) => {
            if (this._longPressTimer) {
                window.clearTimeout(this._longPressTimer);
                this._longPressTimer = undefined;
            }
        };
    }
    render() {
        // SECURITY WARNING:
        //   Note the use of rel='noreferrer'
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        return (React.createElement("a", { style: this._getStyles(), title: this.props.title, href: this.props.url, target: '_blank', rel: 'noreferrer', onClick: this._onClick, onMouseEnter: this.props.onHoverStart, onMouseLeave: this.props.onHoverEnd, onMouseDown: this._onMouseDown }, this.props.children));
    }
    _getStyles() {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        let combinedStyles = Styles_1.default.combine(this.props.numberOfLines === 1 ? _styles.ellipsis : _styles.defaultStyle, this.props.style);
        // Handle cursor styles
        if (this.props.selectable) {
            combinedStyles['userSelect'] = 'text';
            combinedStyles['WebkitUserSelect'] = 'text';
            combinedStyles['MozUserSelect'] = 'text';
            combinedStyles['msUserSelect'] = 'text';
        }
        combinedStyles['cursor'] = 'pointer';
        return combinedStyles;
    }
}
exports.Link = Link;
FocusManager_1.applyFocusableComponentMixin(Link);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Link;
