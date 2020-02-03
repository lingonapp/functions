"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isTimestamp(v) { return !!v && (typeof v == 'object') && !!v.toDate && !!v.toMillis && (typeof v.nanoseconds == 'number') && (typeof v.seconds == 'number'); }
exports.isTimestamp = isTimestamp;
;
function toArrayMax(n, arr) { return arr.slice(0, n); }
exports.toArrayMax = toArrayMax;
function isGeoPoint(v) { return !!v && (typeof v == 'object') && (typeof v.isEqual == 'function') && (typeof v.latitude == 'number') && (typeof v.longitude == 'number'); }
exports.isGeoPoint = isGeoPoint;
;
