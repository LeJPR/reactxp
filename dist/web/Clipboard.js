/**
* Clipboard.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Clipboard abstraction.
*/
"use strict";
const RX = require("../common/Interfaces");
class Clipboard extends RX.Clipboard {
    setText(text) {
        let node = Clipboard._createInvisibleNode();
        node.textContent = text;
        document.body.appendChild(node);
        Clipboard._copyNode(node);
        document.body.removeChild(node);
    }
    getText() {
        // Not supported in web platforms. This should can be only handled in the paste event handlers
        throw 'Not implemented';
    }
    static _createInvisibleNode() {
        const node = document.createElement('span');
        node.style.position = 'absolute';
        node.style.left = '-10000px';
        const style = node.style;
        // Explicitly mark the node as selectable.
        if (style['userSelect'] !== undefined) {
            style['userSelect'] = 'text';
        }
        if (style['msUserSelect'] !== undefined) {
            style['msUserSelect'] = 'text';
        }
        if (style['webkitUserSelect'] !== undefined) {
            style['webkitUserSelect'] = 'text';
        }
        if (style['MozUserSelect'] !== undefined) {
            style['MozUserSelect'] = 'text';
        }
        return node;
    }
    static _copyNode(node) {
        const selection = getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
    }
}
exports.Clipboard = Clipboard;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Clipboard();
