"use strict";
const Image_1 = require("../native-common/Image");
class Image extends Image_1.Image {
    // Overwrite the style for android since native Image has a fade in animation when an image loads
    // Setting the fadeDuration to 0, removes that animation
    _getAdditionalProps() {
        return { fadeDuration: 0 };
    }
}
exports.Image = Image;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Image;
