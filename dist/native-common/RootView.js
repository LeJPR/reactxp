/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/
"use strict";
const React = require("react");
const RN = require("react-native");
const Accessibility_1 = require("./Accessibility");
const AccessibilityUtil_1 = require("./AccessibilityUtil");
const FrontLayerViewManager_1 = require("./FrontLayerViewManager");
const MainViewStore_1 = require("./MainViewStore");
const Styles_1 = require("./Styles");
const Types = require("../common/Types");
const _styles = {
    rootViewStyle: Styles_1.default.createViewStyle({
        flex: 1,
        alignItems: 'stretch',
        overflow: 'visible'
    }),
    liveRegionContainer: Styles_1.default.createViewStyle({
        position: 'absolute',
        opacity: 0,
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        height: 30
    })
};
class RootView extends React.Component {
    constructor() {
        super();
        this._changeListener = this._onChange.bind(this);
        this._frontLayerViewChangedSubscription = null;
        this._newAnnouncementEventChangedSubscription = null;
        this.state = {
            mainView: null,
            announcementText: ''
        };
    }
    componentWillMount() {
        MainViewStore_1.default.subscribe(this._changeListener);
        this._frontLayerViewChangedSubscription = FrontLayerViewManager_1.default.event_changed.subscribe(() => {
            // Setting empty state will trigger a render.
            this.setState({});
        });
        // Update announcement text.  
        this._newAnnouncementEventChangedSubscription =
            Accessibility_1.default.newAnnouncementReadyEvent.subscribe(announcement => {
                this.setState({
                    announcementText: announcement
                });
            });
        this.setState(this._getStateFromStore());
    }
    componentWillUnmount() {
        this._frontLayerViewChangedSubscription.unsubscribe();
        this._frontLayerViewChangedSubscription = null;
        this._newAnnouncementEventChangedSubscription.unsubscribe();
        this._newAnnouncementEventChangedSubscription = null;
        MainViewStore_1.default.unsubscribe(this._changeListener);
    }
    render() {
        const modalLayerView = FrontLayerViewManager_1.default.getModalLayerView(this);
        const popupLayerView = FrontLayerViewManager_1.default.getPopupLayerView(this);
        // When showing a modal/popup we want to hide the mainView shown behind from an accessibility
        // standpoint to ensure that it won't get the focus and the screen reader's attention.
        const importantForAccessibility = (modalLayerView || popupLayerView) ?
            AccessibilityUtil_1.default.importantForAccessibilityToString(Types.ImportantForAccessibility.NoHideDescendants) :
            undefined; // default
        return (React.createElement(RN.Animated.View, { style: _styles.rootViewStyle },
            React.createElement(RN.View, { style: _styles.rootViewStyle, importantForAccessibility: importantForAccessibility }, this.state.mainView),
            modalLayerView,
            popupLayerView,
            React.createElement(RN.View, { style: _styles.liveRegionContainer, accessibilityLabel: this.state.announcementText, accessibilityLiveRegion: AccessibilityUtil_1.default.accessibilityLiveRegionToString(Types.AccessibilityLiveRegion.Polite) })));
    }
    _onChange() {
        this.setState(this._getStateFromStore());
    }
    _getStateFromStore() {
        return {
            mainView: MainViewStore_1.default.getMainView()
        };
    }
}
exports.RootView = RootView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootView;
