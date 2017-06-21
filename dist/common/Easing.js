/**
* Easing.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Easing functions for animations.
*/
"use strict";
const Bezier = require("./Bezier");
class Easing {
    CubicBezier(x1, y1, x2, y2) {
        return Bezier.bezier(x1, y1, x2, y2);
    }
    Default() {
        let bezier = this.CubicBezier(0.42, 0, 1, 1);
        return bezier;
    }
    Linear(input) {
        return input;
    }
    Out() {
        let bezier = this.CubicBezier(0, 0, 0.58, 1);
        return bezier;
    }
    In() {
        let bezier = this.CubicBezier(0.42, 0, 1, 1);
        return bezier;
    }
    InOut() {
        let bezier = this.CubicBezier(0.42, 0, 0.58, 1);
        return bezier;
    }
    OutBack() {
        let bezier = this.CubicBezier(0.175, 0.885, 0.320, 1.275);
        return bezier;
    }
    InBack() {
        let bezier = this.CubicBezier(0.600, -0.280, 0.735, 0.045);
        return bezier;
    }
    InOutBack() {
        let bezier = this.CubicBezier(0.680, -0.550, 0.265, 1.550);
        return bezier;
    }
    Steps(intervals, end = true) {
        return (input) => {
            let interval = intervals * input;
            if (end) {
                interval = Math.floor(interval);
            }
            else {
                interval = Math.ceil(interval);
            }
            return interval / intervals;
        };
    }
    StepStart() {
        let steps = this.Steps(1, false);
        return steps;
    }
    StepEnd() {
        let steps = this.Steps(1, true);
        return steps;
    }
}
exports.Easing = Easing;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Easing();
