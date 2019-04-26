"use strict";
exports.__esModule = true;
var create_hash_1 = require("create-hash");
exports.ripemd160 = function (buf) {
    return create_hash_1["default"]('rmd160')
        .update(buf)
        .digest();
};
exports.sha1 = function (buf) {
    return create_hash_1["default"]('sha1')
        .update(buf)
        .digest();
};
exports.sha256 = function (buf) {
    return create_hash_1["default"]('sha256')
        .update(buf)
        .digest();
};
exports.hash160 = function (buf) {
    return exports.ripemd160(exports.sha256(buf));
};
exports.hash256 = function (buf) {
    return exports.sha256(exports.sha256(buf));
};
