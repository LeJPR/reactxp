/**
* lodashMini.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Imports a subset of lodash library needed for ReactXP's implementation.
*/
"use strict";
const clone = require("lodash/clone");
exports.clone = clone;
const filter = require("lodash/filter");
exports.filter = filter;
const pull = require("lodash/pull");
exports.pull = pull;
const sortBy = require("lodash/sortBy");
exports.sortBy = sortBy;
