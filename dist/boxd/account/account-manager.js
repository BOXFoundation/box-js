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
    function AccountManager(acc_list, update_func) {
        if (update_func === void 0) { update_func = function (new_acc_list) {
            return new_acc_list;
        }; }
        this.acc_list = acc_list;
        this.update_func = update_func;
    }
    /**
     * @func add_New_Account_to_Account_List
     * @param {*cryptoJSON}
     * @memberof AccountManager
     */
    AccountManager.prototype.addToAccList = function (cryptoJSON, otherInfo) {
        var address = cryptoJSON.address;
        var updateTime = Date.now();
        // console.log('acc_list:', this.acc_list)
        // console.log('address:', address)
        if (this.acc_list[address]) {
            console.warn('This Account already existed. It will be rewrited...');
        }
        this.acc_list[address] = __assign({ cryptoJSON: cryptoJSON }, {
            updateTime: updateTime
        }, otherInfo);
        this.update_func && this.update_func(this.acc_list);
    };
    /**
     * @func Sort_account_list
     * @returns [account_list]
     * @memberof AccountManager
     */
    AccountManager.prototype.sortAccList = function () {
        return Object.values(this.acc_list).sort(function (a, b) { return a.updateTime - b.updateTime; });
    };
    return AccountManager;
}());
exports.default = AccountManager;
