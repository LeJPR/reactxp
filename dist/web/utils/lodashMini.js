/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Import and re-export of part of the lodash module. This helps reduce bundle size.
*/
"use strict";
const assign = require("lodash/assign");
exports.assign = assign;
const clone = require("lodash/clone");
exports.clone = clone;
const cloneDeep = require("lodash/cloneDeep");
exports.cloneDeep = cloneDeep;
const defer = require("lodash/defer");
exports.defer = defer;
const each = require("lodash/each");
exports.each = each;
const endsWith = require("lodash/endsWith");
exports.endsWith = endsWith;
const extend = require("lodash/extend");
exports.extend = extend;
const filter = require("lodash/filter");
exports.filter = filter;
const findIndex = require("lodash/findIndex");
exports.findIndex = findIndex;
const findLast = require("lodash/findLast");
exports.findLast = findLast;
const flatten = require("lodash/flatten");
exports.flatten = flatten;
const get = require("lodash/get");
exports.get = get;
const isArray = require("lodash/isArray");
exports.isArray = isArray;
const isEmpty = require("lodash/isEmpty");
exports.isEmpty = isEmpty;
const isEqual = require("lodash/isEqual");
exports.isEqual = isEqual;
const isNumber = require("lodash/isNumber");
exports.isNumber = isNumber;
const isObject = require("lodash/isObject");
exports.isObject = isObject;
const kebabCase = require("lodash/kebabCase");
exports.kebabCase = kebabCase;
const keys = require("lodash/keys");
exports.keys = keys;
const map = require("lodash/map");
exports.map = map;
const mapValues = require("lodash/mapValues");
exports.mapValues = mapValues;
const max = require("lodash/max");
exports.max = max;
const memoize = require("lodash/memoize");
exports.memoize = memoize;
const merge = require("lodash/merge");
exports.merge = merge;
const omit = require("lodash/omit");
exports.omit = omit;
const remove = require("lodash/remove");
exports.remove = remove;
const throttle = require("lodash/throttle");
exports.throttle = throttle;
const union = require("lodash/union");
exports.union = union;
