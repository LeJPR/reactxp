/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform TextInput abstraction.
*/
"use strict";
const _ = require("./lodashMini");
const React = require("react");
const RN = require("react-native");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const _styles = {
    defaultTextInput: Styles_1.default.createTextInputStyle({
        padding: 0
    })
};
class TextInput extends RX.TextInput {
    constructor(props) {
        super(props);
        this._selectionStart = 0;
        this._selectionEnd = 0;
        this._onFocus = (e) => {
            this.setState({ isFocused: true });
            if (this.props.onFocus) {
                this.props.onFocus(e);
            }
        };
        this._onBlur = (e) => {
            this.setState({ isFocused: false });
            if (this.props.onBlur) {
                this.props.onBlur(e);
            }
        };
        this._onChangeText = (newText) => {
            this.setState({ inputValue: newText });
            if (this.props.onChangeText) {
                this.props.onChangeText(newText);
            }
        };
        this._onSelectionChange = (selEvent) => {
            let selection = selEvent.nativeEvent.selection;
            /**
             * On iOS this callback is called BEFORE the _onChangeText, which means the inputValue hasn't had time to get updated yet
             * and cursor would always be one character behind. Fix this problem on Android only.
             */
            this._selectionStart = (RN.Platform.OS !== 'ios') ? Math.min(selection.start, this.state.inputValue.length) : selection.start;
            this._selectionEnd = (RN.Platform.OS !== 'ios') ? Math.min(selection.end, this.state.inputValue.length) : selection.end;
            if (this.props.onSelectionChange) {
                this.props.onSelectionChange(this._selectionStart, this._selectionEnd);
            }
            this.forceUpdate();
        };
        this._onKeyPress = (e) => {
            if (this.props.onKeyPress) {
                let keyName = e.nativeEvent.key;
                let keyCode = 0;
                if (keyName.length === 1) {
                    keyCode = keyName.charCodeAt(0);
                }
                else {
                    switch (keyName) {
                        case 'Enter':
                            keyCode = 13;
                            break;
                        case 'Tab':
                            keyCode = 9;
                            break;
                        case 'Backspace':
                            keyCode = 8;
                            break;
                    }
                }
                // We need to add keyCode to the original event, but React Native
                // reuses events, so we're not allowed to modify the original.
                // Instead, we'll clone it.
                let keyEvent = _.clone(e);
                keyEvent.keyCode = keyCode;
                keyEvent.stopPropagation = () => {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                };
                keyEvent.preventDefault = () => {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                };
                this.props.onKeyPress(keyEvent);
            }
        };
        this._onScroll = (e) => {
            if (this.props.onScroll) {
                const { contentOffset } = e.nativeEvent;
                this.props.onScroll(contentOffset.x, contentOffset.y);
            }
        };
        this.state = {
            inputValue: props.value || '',
            isFocused: false
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value
            });
        }
    }
    render() {
        const editable = (this.props.editable !== undefined ? this.props.editable : true);
        const blurOnSubmit = this.props.blurOnSubmit || !this.props.multiline;
        return (React.createElement(RN.TextInput, { ref: 'nativeTextInput', multiline: this.props.multiline, style: Styles_1.default.combine(_styles.defaultTextInput, this.props.style), value: this.state.inputValue, autoCorrect: this.props.autoCorrect, spellCheck: this.props.spellCheck, autoCapitalize: this.props.autoCapitalize, autoFocus: this.props.autoFocus, keyboardType: this.props.keyboardType, editable: editable, selectionColor: this.props.selectionColor, maxLength: this.props.maxLength, placeholder: this.props.placeholder, defaultValue: this.props.value, placeholderTextColor: this.props.placeholderTextColor, onSubmitEditing: this.props.onSubmitEditing, onKeyPress: this._onKeyPress, onChangeText: this._onChangeText, onSelectionChange: this._onSelectionChange, onFocus: this._onFocus, onBlur: this._onBlur, onScroll: this._onScroll, selection: { start: this._selectionStart, end: this._selectionEnd }, secureTextEntry: this.props.secureTextEntry, textAlign: this.props.textAlign, keyboardAppearance: this.props.keyboardAppearance, returnKeyType: this.props.returnKeyType, disableFullscreenUI: this.props.disableFullscreenUI, blurOnSubmit: blurOnSubmit, textBreakStrategy: 'simple', accessibilityLabel: this.props.accessibilityLabel, allowFontScaling: this.props.allowFontScaling, maxContentSizeMultiplier: this.props.maxContentSizeMultiplier, underlineColorAndroid: 'transparent' }));
    }
    blur() {
        this.refs['nativeTextInput'].blur();
    }
    focus() {
        this.refs['nativeTextInput'].focus();
        AccessibilityUtil_1.default.setAccessibilityFocus(this);
    }
    isFocused() {
        return this.state.isFocused;
    }
    selectAll() {
        // to make selection visible we have to implement it in native
        // http://stackoverflow.com/questions/1689911/programatically-select-all-text-in-uitextfield
    }
    selectRange(start, end) {
        const constrainedStart = Math.min(start, this.state.inputValue.length);
        const constrainedEnd = Math.min(end, this.state.inputValue.length);
        this._selectionStart = constrainedStart;
        this._selectionEnd = constrainedEnd;
        this.forceUpdate();
    }
    getSelectionRange() {
        let range = {
            start: this._selectionStart,
            end: this._selectionEnd
        };
        return range;
    }
    setValue(value) {
        this._onChangeText(value);
    }
}
exports.TextInput = TextInput;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextInput;
