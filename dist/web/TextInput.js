/**
* TextInput.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform TextInput abstraction.
*/
"use strict";
const _ = require("./utils/lodashMini");
const React = require("react");
const ReactDOM = require("react-dom");
const RX = require("../common/Interfaces");
const Styles_1 = require("./Styles");
const FocusManager_1 = require("./utils/FocusManager");
let _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexBasis: 'auto',
        flex: '0 0 auto',
        overflowX: 'hidden',
        overflowY: 'auto',
        alignItems: 'stretch'
    }
};
class TextInput extends RX.TextInput {
    constructor(props) {
        super(props);
        this._selectionStart = 0;
        this._selectionEnd = 0;
        this._onPaste = (e) => {
            if (this.props.onPaste) {
                this.props.onPaste(e);
            }
            this._checkSelectionChanged();
        };
        this._onInput = (e) => {
            if (!e.defaultPrevented) {
                let el = ReactDOM.findDOMNode(this);
                if (el) {
                    // Has the input value changed?
                    const value = el.value || '';
                    if (this.state.inputValue !== value) {
                        // If the parent component didn't specify a value, we'll keep
                        // track of the modified value.
                        if (this.props.value === undefined) {
                            this.setState({
                                inputValue: value
                            });
                        }
                        if (this.props.onChangeText) {
                            this.props.onChangeText(value);
                        }
                    }
                    this._checkSelectionChanged();
                }
            }
        };
        this._checkSelectionChanged = () => {
            let el = ReactDOM.findDOMNode(this);
            if (el) {
                if (this._selectionStart !== el.selectionStart || this._selectionEnd !== el.selectionEnd) {
                    this._selectionStart = el.selectionStart;
                    this._selectionEnd = el.selectionEnd;
                    if (this.props.onSelectionChange) {
                        this.props.onSelectionChange(this._selectionStart, this._selectionEnd);
                    }
                }
            }
        };
        this._onKeyDown = (e) => {
            // Generate a "submit editing" event if the user
            // pressed enter or return.
            if (e.keyCode === 13 && (!this.props.multiline || this.props.blurOnSubmit)) {
                if (this.props.onSubmitEditing) {
                    this.props.onSubmitEditing();
                }
                if (this.props.blurOnSubmit) {
                    this.blur();
                }
            }
            if (this.props.onKeyPress) {
                this.props.onKeyPress(e);
            }
            this._checkSelectionChanged();
        };
        this._onScroll = (e) => {
            if (this.props.onScroll) {
                const { scrollLeft, scrollTop } = e.target;
                this.props.onScroll(scrollLeft, scrollTop);
            }
        };
        this.state = {
            inputValue: props.value || props.defaultValue || ''
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== undefined && nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value || ''
            });
        }
    }
    componentDidMount() {
        if (this.props.autoFocus) {
            this.focus();
        }
    }
    render() {
        let combinedStyles = Styles_1.default.combine(_styles.defaultStyle, this.props.style);
        // Always hide the outline and border.
        combinedStyles = _.extend({
            outline: 'none',
            border: 'none',
            resize: 'none'
        }, combinedStyles);
        // By default, the control is editable.
        const editable = (this.props.editable !== undefined ? this.props.editable : true);
        const spellCheck = (this.props.spellCheck !== undefined ? this.props.spellCheck : this.props.autoCorrect);
        // Use a textarea for multi-line and a regular input for single-line.
        if (this.props.multiline) {
            return (React.createElement("textarea", { style: combinedStyles, value: this.state.inputValue, autoCorrect: this.props.autoCorrect, spellCheck: spellCheck, disabled: !editable, maxLength: this.props.maxLength, placeholder: this.props.placeholder, onInput: this._onInput, onKeyDown: this._onKeyDown, onKeyUp: this._checkSelectionChanged, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onMouseDown: this._checkSelectionChanged, onMouseUp: this._checkSelectionChanged, onPaste: this._onPaste, onScroll: this._onScroll, "aria-label": this.props.accessibilityLabel }));
        }
        else {
            return (React.createElement("input", { style: combinedStyles, value: this.state.inputValue, autoCorrect: this.props.autoCorrect, spellCheck: spellCheck, disabled: !editable, maxLength: this.props.maxLength, placeholder: this.props.placeholder, onInput: this._onInput, onKeyDown: this._onKeyDown, onKeyUp: this._checkSelectionChanged, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onMouseDown: this._checkSelectionChanged, onMouseUp: this._checkSelectionChanged, onPaste: this._onPaste, "aria-label": this.props.accessibilityLabel, type: this.props.secureTextEntry ? 'password' : 'text' }));
        }
    }
    blur() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    }
    focus() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    }
    isFocused() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            return document.activeElement === el;
        }
        return false;
    }
    selectAll() {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.select();
        }
    }
    selectRange(start, end) {
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            el.setSelectionRange(start, end);
        }
    }
    getSelectionRange() {
        let range = {
            start: 0,
            end: 0
        };
        let el = ReactDOM.findDOMNode(this);
        if (el) {
            range.start = el.selectionStart;
            range.end = el.selectionEnd;
        }
        return range;
    }
    setValue(value) {
        const inputValue = value || '';
        if (this.state.inputValue !== inputValue) {
            // It's important to set the actual value in the DOM immediately. This allows us to call other related methods
            // like selectRange synchronously afterward.
            let el = ReactDOM.findDOMNode(this);
            if (el) {
                el.value = inputValue;
            }
            this.setState({
                inputValue: inputValue
            });
            if (this.props.onChangeText) {
                this.props.onChangeText(value);
            }
        }
    }
}
exports.TextInput = TextInput;
FocusManager_1.applyFocusableComponentMixin(TextInput);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextInput;
