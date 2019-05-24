"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AccountManager = /** @class */ (function () {
    function AccountManager(acc_list, updateAccount) {
        if (updateAccount === void 0) { updateAccount = function (new_acc_list) {
            return new_acc_list;
        }; }
        this.acc_list = acc_list;
        this.updateAccount = updateAccount;
    }
    /**
     * @func add-new-wallet-to-walletList
     * @param {*cryptoJson} { address ... }
     * @memberof Account
     */
    AccountManager.prototype.addToAccList = function (cryptoJson, otherInfo) {
        var address = cryptoJson.address;
        var updateTime = Date.now();
        if (this.acc_list[address]) {
            console.warn('This Account already existed. It will be rewrited...');
        }
        this.acc_list[address] = __assign({ cryptoJson: cryptoJson }, {
            updateTime: updateTime
        }, otherInfo);
        this.updateAccount && this.updateAccount(this.acc_list);
    };
    AccountManager.prototype.sortAccList = function () {
        return Object.values(this.acc_list).sort(function (a, b) { return a.updateTime - b.updateTime; });
    };
    return AccountManager;
}());
exports.default = AccountManager;
