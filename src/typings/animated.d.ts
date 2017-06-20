/**
* animated.d.ts
*
* Type definition file for React Native, based on the React.js definition file on https://github.com/borisyankov/DefinitelyTyped.
*/


 declare module 'animated' {
  module Animated {
         class Value {
            constructor(val: number);
            setValue(value: number): void;
            addListener(callback: any): number;
            removeListener(id: string): void;
            removeAllListeners(): void;
            interpolate(config: any): Value;
         }
     }
 }
     