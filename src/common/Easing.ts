/**
* Easing.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Easing functions for animations.
*/

import Bezier = require('./Bezier');
import Types = require('./Types');

export class Easing implements Types.Animated.Easing {
    CubicBezier(x1: number, y1: number, x2: number, y2: number): Types.Animated.EasingFunction {
        return  Bezier.bezier(x1, y1, x2, y2);
      
    }

    Default(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.42, 0, 1, 1);
        return bezier;
        
    }

    Linear(input: number): Types.Animated.EasingFunction {
        return input; 
        
    }

    Out(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0, 0, 0.58, 1);
        return  bezier;
        
    }

    In(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.42, 0, 1, 1);
        return bezier;
    }

    InOut(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.42, 0, 0.58, 1);
        return bezier;
    }

    OutBack(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.175, 0.885, 0.320, 1.275);
        return bezier;
    }

    InBack(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.600, -0.280, 0.735, 0.045);
        return bezier;
    }

    InOutBack(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.680, -0.550, 0.265, 1.550);
        return bezier;
    }

    Steps(intervals: number, end: boolean = true): Types.Animated.EasingFunction {
        return  (input: number) => {
                let interval = intervals * input;
                if (end) {
                    interval = Math.floor(interval);
                } else {
                    interval = Math.ceil(interval);
                }
                return interval / intervals;
            };
        
    }

    StepStart(): Types.Animated.EasingFunction {
        let steps = this.Steps(1, false);
        return steps;
    }

    StepEnd(): Types.Animated.EasingFunction {
        let steps = this.Steps(1, true);
        return steps;
    }
}

export default new Easing();
