/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Import and re-export of part of the lodash module. This helps reduce bundle size.
*/
"use strict";
const clone = require("lodash/clone");
exports.clone = clone;
const compact = require("lodash/compact");
exports.compact = compact;
const extend = require("lodash/extend");
exports.extend = extend;
const filter = require("lodash/filter");
exports.filter = filter;
const findIndex = require("lodash/findIndex");
exports.findIndex = findIndex;
const findLast = require("lodash/findLast");
exports.findLast = findLast;
const isArray = require("lodash/isArray");
exports.isArray = isArray;
const isEqual = require("lodash/isEqual");
exports.isEqual = isEqual;
const isNumber = require("lodash/isNumber");
exports.isNumber = isNumber;
const last = require("lodash/last");
exports.last = last;
const map = require("lodash/map");
exports.map = map;
const max = require("lodash/max");
exports.max = max;
const omit = require("lodash/omit");
exports.omit = omit;
const union = require("lodash/union");
exports.union = union;
