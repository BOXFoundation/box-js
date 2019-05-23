"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var create_hash_1 = __importDefault(require("create-hash"));
var Hash;
(function (Hash) {
    Hash.ripemd160 = function (buf) {
        return create_hash_1.default('rmd160')
            .update(buf)
            .digest();
    };
    Hash.sha1 = function (buf) {
        return create_hash_1.default('sha1')
            .update(buf)
            .digest();
    };
    Hash.sha256 = function (buf) {
        return create_hash_1.default('sha256')
            .update(buf)
            .digest();
    };
    Hash.hash160 = function (buf) {
        return Hash.ripemd160(Hash.sha256(buf));
    };
    Hash.hash256 = function (buf) {
        return Hash.sha256(Hash.sha256(buf));
    };
})(Hash || (Hash = {}));
exports.default = Hash;
