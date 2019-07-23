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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var privatekey_1 = __importDefault(require("../util/crypto/privatekey"));
var AccountManager = /** @class */ (function () {
    function AccountManager(acc_list, updateAccount) {
        if (updateAccount === void 0) { updateAccount = function (new_acc_list) {
            return new_acc_list;
        }; }
        this.acc_list = acc_list;
        this.updateAccount = updateAccount;
    }
    /**
     * @func New_PrivateKey_Object
     * @param [*privkey]
     * @returns [privateKey]
     * @memberof AccountManager
     */
    AccountManager.prototype.newPrivateKey = function (privkey) {
        var privk = new privatekey_1.default(privkey);
        return privk.privKey;
    };
    /**
     * @func Add_New_Account_to_Account_List
     * @param {*cryptoJSON}
     * @memberof AccountManager
     */
    AccountManager.prototype.addToAccList = function (cryptoJSON, otherInfo) {
        var address = cryptoJSON.address;
        var updateTime = Date.now();
        /*     console.log('acc_list:', this.acc_list)
        console.log('address:', address) */
        if (this.acc_list[address]) {
            console.warn('This Account already existed. It will be rewrited...');
        }
        this.acc_list[address] = __assign({ cryptoJSON: cryptoJSON }, {
            updateTime: updateTime
        }, otherInfo);
        this.updateAccount && this.updateAccount(this.acc_list);
    };
    /**
     * @func Sort_Account_List
     * @returns [account_list]
     * @memberof AccountManager
     */
    AccountManager.prototype.sortAccList = function () {
        return Object.values(this.acc_list).sort(function (a, b) { return a.updateTime - b.updateTime; });
    };
    return AccountManager;
}());
exports.default = AccountManager;
