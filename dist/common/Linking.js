/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common implementation for deep linking.
*/
"use strict";
const _ = require("./lodashMini");
const RX = require("../common/Interfaces");
// Collection of Regex that help validate an email.
// The name can be any of these characters.
const emailNameRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.@-]+$/i;
// However, the name cannot contain '..', or start/end with '.'.
const emailNameConstraintViolationRegex = /\.\.|^\.|\.$/i;
// The host is limited to these characters.
const emailHostRegex = /^[a-z0-9.-]+$/i;
// However, the host cannot contain '..', start/end with '.', or have any (sub)domain start/end with '-'.
const emailHostConstraintViolationRegex = /\.\.|^[.-]|[.-]$|\.-|-\./i;
class Linking extends RX.Linking {
    // Launches Email app
    launchEmail(emailInfo) {
        // Format email info
        const emailUrl = this._createEmailUrl(emailInfo);
        return this._openUrl(emailUrl);
    }
    // Launches SMS app
    launchSms(phoneInfo) {
        // Format phone info
        const phoneUrl = this._createSmsUrl(phoneInfo);
        return this._openUrl(phoneUrl);
    }
    // Opens url
    openUrl(url) {
        return this._openUrl(url);
    }
    // Escaped Email uri - mailto:[emailAddress]?subject=<emailSubject>&body=<emailBody>
    _createEmailUrl(emailInfo) {
        let emailUrl = 'mailto:';
        let validEmails;
        if (emailInfo.to && emailInfo.to.length > 0) {
            validEmails = this._filterValidEmails(emailInfo.to);
            emailUrl += validEmails.join(',');
        }
        emailUrl += '?';
        if (emailInfo.cc && emailInfo.cc.length > 0) {
            validEmails = this._filterValidEmails(emailInfo.cc);
            emailUrl += 'cc=' + validEmails.join(',') + '&';
        }
        if (emailInfo.bcc && emailInfo.bcc.length > 0) {
            validEmails = this._filterValidEmails(emailInfo.bcc);
            emailUrl += 'bcc=' + validEmails.join(',') + '&';
        }
        if (emailInfo.subject) {
            emailUrl += 'subject=' + encodeURIComponent(emailInfo.subject) + '&';
        }
        if (emailInfo.body) {
            emailUrl += 'body=' + encodeURIComponent(emailInfo.body);
        }
        return emailUrl;
    }
    // Escaped SMS uri - sms:<phoneNumber>?body=<messageString>
    _createSmsUrl(smsInfo) {
        let smsUrl = 'sms:';
        if (smsInfo.phoneNumber) {
            smsUrl += encodeURI(smsInfo.phoneNumber);
        }
        if (smsInfo.body) {
            smsUrl += '?body=' + encodeURIComponent(smsInfo.body);
        }
        return smsUrl;
    }
    _isEmailValid(email) {
        // Emails have a max length of 254, and the smallest email looks like 'a@io' (with length 4).
        if (!email || email.length > 254 || email.length < 4) {
            return false;
        }
        // Note: using 'last' since '@' is valid in the name (but not the host, otherwise it would be impossible to parse).
        const lastAtIndex = email.lastIndexOf('@');
        // Email must have an '@', and there must be characters on each side of the '@'.
        // Note: the host must have at least two characters.
        if (lastAtIndex === -1 || lastAtIndex === 0 || lastAtIndex >= email.length - 2) {
            return false;
        }
        const name = email.substring(0, lastAtIndex);
        const host = email.substring(lastAtIndex + 1);
        return !emailNameConstraintViolationRegex.test(name)
            && !emailHostConstraintViolationRegex.test(host)
            && emailNameRegex.test(name)
            && emailHostRegex.test(host);
    }
    _filterValidEmails(emails) {
        let validEmails = _.filter(emails, e => {
            return this._isEmailValid(e);
        });
        return validEmails;
    }
}
exports.Linking = Linking;
