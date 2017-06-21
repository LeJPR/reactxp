/**
* Accessibility.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* An iOS variant of Accessibility that performs announcements by calling
* React Native announcement API for iOS.
*/
"use strict";
const RN = require("react-native");
const Accessibility_1 = require("../native-common/Accessibility");
const RetryTimeout = 3000; // 3 seconds
class Accessibility extends Accessibility_1.Accessibility {
    constructor() {
        super();
        // Queue of pending announcements. 
        this._announcementQueue = [];
        this._recalcAnnouncement = (payload) => {
            if (this._announcementQueue.length === 0) {
                return;
            }
            const postedAnnouncement = this._announcementQueue[0];
            // Handle retries if it's the announcement we posted. Drop other announcements.
            if (payload.announcement === postedAnnouncement) {
                const timeElapsed = Date.now() - this._retryTimestamp;
                if (!payload.success && timeElapsed < RetryTimeout) {
                    this._postAnnouncement(payload.announcement, false);
                }
                else {
                    // Successfully announced or timed out. Schedule next announcement. 
                    this._announcementQueue.shift();
                    if (this._announcementQueue.length > 0) {
                        const nextAnnouncement = this._announcementQueue[0];
                        this._postAnnouncement(nextAnnouncement);
                    }
                }
            }
        };
        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when an announcement will finish.  
            RN.AccessibilityInfo.addEventListener('announcementFinished', this._recalcAnnouncement);
        }
    }
    _updateScreenReaderStatus(isEnabled) {
        super._updateScreenReaderStatus(isEnabled);
        // Empty announcement queue when screen reader is disabled. 
        if (!isEnabled && this._announcementQueue.length > 0) {
            this._announcementQueue = [];
        }
    }
    announceForAccessibility(announcement) {
        super.announceForAccessibility(announcement);
        // Update the queue only if screen reader is enabled. Else we won't receive a callback of
        // announcement did finish and queued items will never be removed. 
        if (this._isScreenReaderEnabled) {
            this._announcementQueue.push(announcement);
            // Post announcement if it's the only announcement in queue. 
            if (this._announcementQueue.length === 1) {
                this._postAnnouncement(announcement);
            }
        }
    }
    _postAnnouncement(announcement, resetTimestamp = true) {
        if (resetTimestamp) {
            this._retryTimestamp = Date.now();
        }
        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo && RN.AccessibilityInfo.announceForAccessibility) {
            RN.AccessibilityInfo.announceForAccessibility(announcement);
        }
    }
}
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Accessibility();
