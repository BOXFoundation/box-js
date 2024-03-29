/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var fetch = require('isomorphic-fetch');
var _ = require('underscore');
// var core = require('web3-core')
// var Method = require('web3-core-method')
var utils = require('web3-utils');
// var Subscription = require('web3-core-subscriptions').subscription
var formatters = require('web3-core-helpers').formatters;
var errors = require('web3-core-helpers').errors;
var promiEvent = require('web3-core-promievent');
var abi = require('web3-eth-abi');

var Api = require('../api');
var Feature = require('../feature');

/**
                                      * Should be called to create new contract instance
                                      *
                                      * @method Contract
                                      * @constructor
                                      * @param {Array} jsonInterface
                                      * @param {String} address
                                      * @param {Object} options
                                      */
var Contract = function Contract(jsonInterface, address, options) {
  var _this = this,
  args = Array.prototype.slice.call(arguments);

  if (!(this instanceof Contract)) {
    throw new Error('Please use the "new" keyword to instantiate a web3.eth.contract() object!');
  }

  // TODO
  // sets _requestmanager
  // core.packageInit(this, [this.constructor.currentProvider])

  //this.clearSubscriptions = this._requestManager.clearSubscriptions



  if (!jsonInterface || !Array.isArray(jsonInterface)) {
    throw new Error('You must provide the json interface of the contract when instantiating a contract object.');
  }



  // create the options object
  this.options = {};

  var lastArg = args[args.length - 1];
  if (_.isObject(lastArg) && !_.isArray(lastArg)) {
    options = lastArg;

    this.options = _.extend(this.options, this._getOrSetDefaultOptions(options));
    if (_.isObject(address)) {
      address = null;
    }
  }

  // set address
  Object.defineProperty(this.options, 'address', {
    set: function set(value) {
      if (value) {
        _this._address = value; //utils.toChecksumAddress(formatters.inputAddressFormatter(value))
      }
    },
    get: function get() {
      return _this._address;
    },
    enumerable: true });


  // add method and event signatures, when the jsonInterface gets set
  Object.defineProperty(this.options, 'jsonInterface', {
    set: function set(value) {
      _this.methods = {};
      _this.events = {};

      _this._jsonInterface = value.map(function (method) {
        var func,
        funcName;

        // make constant and payable backwards compatible
        method.constant = method.stateMutability === "view" || method.stateMutability === "pure" || method.constant;
        method.payable = method.stateMutability === "payable" || method.payable;


        if (method.name) {
          funcName = utils._jsonInterfaceMethodToString(method);
        }


        // function
        if (method.type === 'function') {
          method.signature = abi.encodeFunctionSignature(funcName);
          func = _this._createTxObject.bind({
            method: method,
            parent: _this });



          // add method only if not one already exists
          if (!_this.methods[method.name]) {
            _this.methods[method.name] = func;
          } else {
            var cascadeFunc = _this._createTxObject.bind({
              method: method,
              parent: _this,
              nextMethod: _this.methods[method.name] });

            _this.methods[method.name] = cascadeFunc;
          }

          // definitely add the method based on its signature
          _this.methods[method.signature] = func;

          // add method by name
          _this.methods[funcName] = func;


          //   // event
          // } else if (method.type === 'event') {
          //   method.signature = abi.encodeEventSignature(funcName)
          //   var event = _this._on.bind(_this, method.signature)

          //   // add method only if not already exists
          //   if (!_this.events[method.name] || _this.events[method.name].name === 'bound ')
          //     _this.events[method.name] = event

          //   // definitely add the method based on its signature
          //   _this.events[method.signature] = event

          //   // add event by name
          //   _this.events[funcName] = event
        }


        return method;
      });

      // add allEvents
      //   _this.events.allEvents = _this._on.bind(_this, 'allevents')

      return _this._jsonInterface;
    },
    get: function get() {
      return _this._jsonInterface;
    },
    enumerable: true });


  // get default account from the Class
  var defaultAccount = this.constructor.defaultAccount;
  var defaultBlock = this.constructor.defaultBlock || 'latest';

  Object.defineProperty(this, 'defaultAccount', {
    get: function get() {
      return defaultAccount;
    },
    set: function set(val) {
      if (val) {
        defaultAccount = val; //utils.toChecksumAddress(formatters.inputAddressFormatter(val))
      }

      return val;
    },
    enumerable: true });

  Object.defineProperty(this, 'defaultBlock', {
    get: function get() {
      return defaultBlock;
    },
    set: function set(val) {
      defaultBlock = val;

      return val;
    },
    enumerable: true });


  // properties
  this.methods = {};
  this.events = {};

  this._address = null;
  this._jsonInterface = [];

  // set getter/setter properties
  this.options.address = address;
  this.options.jsonInterface = jsonInterface;

};

Contract.setProvider = function (provider, from, privateKey) {
  // Contract.currentProvider = provider
  //   core.packageInit(this, [provider])
  Contract.api = new Api.default(fetch, provider, 'http');
  Contract.feature = new Feature.default(fetch, provider, 'http');

  Contract._from = from;
  Contract._privateKey = privateKey;
};


/**
    * Get the callback and modiufy the array if necessary
    *
    * @method _getCallback
    * @param {Array} args
    * @return {Function} the callback
    */
Contract.prototype._getCallback = function getCallback(args) {
  if (args && _.isFunction(args[args.length - 1])) {
    return args.pop(); // modify the args array!
  }
};

/**
    * Checks that no listener with name "newListener" or "removeListener" is added.
    *
    * @method _checkListener
    * @param {String} type
    * @param {String} event
    * @return {Object} the contract instance
    */
// Contract.prototype._checkListener = function(type, event) {
//   if (event === type) {
//     throw new Error('The event "' + type + '" is a reserved event name, you can\'t use it.')
//   }
// }


/**
 * Use default values, if options are not available
 *
 * @method _getOrSetDefaultOptions
 * @param {Object} options the options gived by the user
 * @return {Object} the options with gaps filled by defaults
 */
Contract.prototype._getOrSetDefaultOptions = function getOrSetDefaultOptions(options) {
  var gasPrice = options.gasPrice ? String(options.gasPrice) : null;
  var from = options.from ? options.from : null;

  options.data = options.data || this.options.data;

  options.from = from || this.options.from;
  options.gasPrice = gasPrice || this.options.gasPrice;
  options.gas = options.gas || options.gasLimit || this.options.gas;

  // TODO replace with only gasLimit?
  delete options.gasLimit;

  return options;
};


/**
    * Should be used to encode indexed params and options to one final object
    *
    * @method _encodeEventABI
    * @param {Object} event
    * @param {Object} options
    * @return {Object} everything combined together and encoded
    */
// Contract.prototype._encodeEventABI = function(event, options) {
//   options = options || {}
//   var filter = options.filter || {},
//     result = {};

//   ['fromBlock', 'toBlock'].filter(function(f) {
//     return options[f] !== undefined
//   }).forEach(function(f) {
//     result[f] = formatters.inputBlockNumberFormatter(options[f])
//   })

//   // use given topics
//   if (_.isArray(options.topics)) {
//     result.topics = options.topics

//     // create topics based on filter
//   } else {

//     result.topics = []

//     // add event signature
//     if (event && !event.anonymous && event.name !== 'ALLEVENTS') {
//       result.topics.push(event.signature)
//     }

//     // add event topics (indexed arguments)
//     if (event.name !== 'ALLEVENTS') {
//       var indexedTopics = event.inputs.filter(function(i) {
//         return i.indexed === true
//       }).map(function(i) {
//         var value = filter[i.name]
//         if (!value) {
//           return null
//         }

//         // TODO: https://github.com/ethereum/web3.js/issues/344
//         // TODO: deal properly with components

//         if (_.isArray(value)) {
//           return value.map(function(v) {
//             return abi.encodeParameter(i.type, v)
//           })
//         }
//         return abi.encodeParameter(i.type, value)
//       })

//       result.topics = result.topics.concat(indexedTopics)
//     }

//     if (!result.topics.length)
//       delete result.topics
//   }

//   if (this.options.address) {
//     result.address = this.options.address.toLowerCase()
//   }

//   return result
// }

/**
 * Should be used to decode indexed params and options
 *
 * @method _decodeEventABI
 * @param {Object} data
 * @return {Object} result object with decoded indexed && not indexed params
 */
// Contract.prototype._decodeEventABI = function(data) {
//   var event = this

//   data.data = data.data || ''
//   data.topics = data.topics || []
//   var result = formatters.outputLogFormatter(data)

//   // if allEvents get the right event
//   if (event.name === 'ALLEVENTS') {
//     event = event.jsonInterface.find(function(intf) {
//       return (intf.signature === data.topics[0])
//     }) || { anonymous: true }
//   }

//   // create empty inputs if none are present (e.g. anonymous events on allEvents)
//   event.inputs = event.inputs || []


//   var argTopics = event.anonymous ? data.topics : data.topics.slice(1)

//   result.returnValues = abi.decodeLog(event.inputs, data.data, argTopics)
//   delete result.returnValues.__length__

//   // add name
//   result.event = event.name

//   // add signature
//   result.signature = (event.anonymous || !data.topics[0]) ? null : data.topics[0]

//   // move the data and topics to "raw"
//   result.raw = {
//     data: result.data,
//     topics: result.topics
//   }
//   delete result.data
//   delete result.topics


//   return result
// }

/**
 * Encodes an ABI for a method, including signature or the method.
 * Or when constructor encodes only the constructor parameters.
 *
 * @method _encodeMethodABI
 * @param {Mixed} args the arguments to encode
 * @param {String} the encoded ABI
 */
Contract.prototype._encodeMethodABI = function _encodeMethodABI() {
  var methodSignature = this._method.signature,
  args = this.arguments || [];

  var signature = false,
  paramsABI = this._parent.options.jsonInterface.filter(function (json) {
    return methodSignature === 'constructor' && json.type === methodSignature ||
    (json.signature === methodSignature || json.signature === methodSignature.replace('0x', '') || json.name === methodSignature) && json.type === 'function';
  }).map(function (json) {
    var inputLength = _.isArray(json.inputs) ? json.inputs.length : 0;

    if (inputLength !== args.length) {
      throw new Error('The number of arguments is not matching the methods required number. You need to pass ' + inputLength + ' arguments.');
    }

    if (json.type === 'function') {
      signature = json.signature;
    }
    return _.isArray(json.inputs) ? json.inputs : [];
  }).map(function (inputs) {
    return abi.encodeParameters(inputs, args).replace('0x', '');
  })[0] || '';

  // return constructor
  if (methodSignature === 'constructor') {
    if (!this._deployData)
    throw new Error('The contract has no contract data option set. This is necessary to append the constructor parameters.');

    return this._deployData + paramsABI;

    // return method
  } else {

    var returnValue = signature ? signature + paramsABI : paramsABI;

    if (!returnValue) {
      throw new Error('Couldn\'t find a matching contract method named "' + this._method.name + '".');
    } else {
      return returnValue;
    }
  }

};


/**
    * Decode method return values
    *
    * @method _decodeMethodReturn
    * @param {Array} outputs
    * @param {String} returnValues
    * @return {Object} decoded output return values
    */
Contract.prototype._decodeMethodReturn = function (outputs, returnValues) {
  if (!returnValues) {
    return null;
  }

  returnValues = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
  var result = abi.decodeParameters(outputs, returnValues);

  if (result.__length__ === 1) {
    return result[0];
  } else {
    delete result.__length__;
    return result;
  }
};


/**
    * Deploys a contract and fire events based on its state: transactionHash, receipt
    *
    * All event listeners will be removed, once the last possible event is fired ("error", or "receipt")
    *
    * @method deploy
    * @param {Object} options
    * @param {Function} callback
    * @return {Object} EventEmitter possible events are "error", "transactionHash" and "receipt"
    */
Contract.prototype.deploy = function (options, callback) {

  options = options || {};

  options.arguments = options.arguments || [];
  options = this._getOrSetDefaultOptions(options);


  // return error, if no "data" is specified
  if (!options.data) {
    return utils._fireError(new Error('No "data" specified in neither the given options, nor the default options.'), null, null, callback);
  }

  var constructor = _.find(this.options.jsonInterface, function (method) {
    return method.type === 'constructor';
  }) || {};
  constructor.signature = 'constructor';

  return this._createTxObject.apply({
    method: constructor,
    parent: this,
    deployData: options.data,
    _ethAccounts: this.constructor._ethAccounts },
  options.arguments);

};

/**
    * Gets the event signature and outputformatters
    *
    * @method _generateEventOptions
    * @param {Object} event
    * @param {Object} options
    * @param {Function} callback
    * @return {Object} the event options object
    */
// Contract.prototype._generateEventOptions = function() {
//   var args = Array.prototype.slice.call(arguments)

//   // get the callback
//   var callback = this._getCallback(args)

//   // get the options
//   var options = (_.isObject(args[args.length - 1])) ? args.pop() : {}

//   var event = (_.isString(args[0])) ? args[0] : 'allevents'
//   event = (event.toLowerCase() === 'allevents') ? {
//     name: 'ALLEVENTS',
//     jsonInterface: this.options.jsonInterface
//   } : this.options.jsonInterface.find(function(json) {
//     return (json.type === 'event' && (json.name === event || json.signature === '0x' + event.replace('0x', '')))
//   })

//   if (!event) {
//     throw new Error('Event "' + event.name + '" doesn\'t exist in this contract.')
//   }

//   if (!utils.isAddress(this.options.address)) {
//     throw new Error('This contract object doesn\'t have address set yet, please set an address first.')
//   }

//   return {
//     params: this._encodeEventABI(event, options),
//     event: event,
//     callback: callback
//   }
// }

/**
 * Adds event listeners and creates a subscription, and remove it once its fired.
 *
 * @method clone
 * @return {Object} the event subscription
 */
Contract.prototype.clone = function () {
  return new this.constructor(this.options.jsonInterface, this.options.address, this.options);
};


/**
    * Adds event listeners and creates a subscription, and remove it once its fired.
    *
    * @method once
    * @param {String} event
    * @param {Object} options
    * @param {Function} callback
    * @return {Object} the event subscription
    */
// Contract.prototype.once = function(event, options, callback) {
//   var args = Array.prototype.slice.call(arguments)

//   // get the callback
//   callback = this._getCallback(args)

//   if (!callback) {
//     throw new Error('Once requires a callback as the second parameter.')
//   }

//   // don't allow fromBlock
//   if (options)
//     delete options.fromBlock

//   // don't return as once shouldn't provide "on"
//   this._on(event, options, function(err, res, sub) {
//     sub.unsubscribe()
//     if (_.isFunction(callback)) {
//       callback(err, res, sub)
//     }
//   })

//   return undefined
// }

/**
 * Adds event listeners and creates a subscription.
 *
 * @method _on
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event subscription
 */
// Contract.prototype._on = function() {
//   var subOptions = this._generateEventOptions.apply(this, arguments)


//   // prevent the event "newListener" and "removeListener" from being overwritten
//   this._checkListener('newListener', subOptions.event.name, subOptions.callback)
//   this._checkListener('removeListener', subOptions.event.name, subOptions.callback)

//   // TODO check if listener already exists? and reuse subscription if options are the same.

//   // create new subscription
//   var subscription = new Subscription({
//     subscription: {
//       params: 1,
//       inputFormatter: [formatters.inputLogFormatter],
//       outputFormatter: this._decodeEventABI.bind(subOptions.event),
//       // DUBLICATE, also in web3-eth
//       subscriptionHandler: function(output) {
//         if (output.removed) {
//           this.emit('changed', output)
//         } else {
//           this.emit('data', output)
//         }

//         if (_.isFunction(this.callback)) {
//           this.callback(null, output, this)
//         }
//       }
//     },
//     type: 'eth',
//     requestManager: this._requestManager
//   })
//   subscription.subscribe('logs', subOptions.params, subOptions.callback || function() {})

//   return subscription
// }

/**
 * Get past events from contracts
 *
 * @method getPastEvents
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the promievent
 */
// Contract.prototype.getPastEvents = function() {
//   var subOptions = this._generateEventOptions.apply(this, arguments)

//   var getPastLogs = new Method({
//     name: 'getPastLogs',
//     call: 'eth_getLogs',
//     params: 1,
//     inputFormatter: [formatters.inputLogFormatter],
//     outputFormatter: this._decodeEventABI.bind(subOptions.event)
//   })
//   getPastLogs.setRequestManager(this._requestManager)
//   var call = getPastLogs.buildCall()

//   getPastLogs = null

//   return call(subOptions.params, subOptions.callback)
// }


/**
 * returns the an object with call, send, estimate functions
 *
 * @method _createTxObject
 * @returns {Object} an object with functions to call the methods
 */
Contract.prototype._createTxObject = function _createTxObject() {
  var args = Array.prototype.slice.call(arguments);
  var txObject = {};

  if (this.method.type === 'function') {

    txObject.call = this.parent._executeMethod.bind(txObject, 'call');
    txObject.call.request = this.parent._executeMethod.bind(txObject, 'call', true); // to make batch requests

  }

  txObject.send = this.parent._executeMethod.bind(txObject, 'send');
  txObject.send.request = this.parent._executeMethod.bind(txObject, 'send', true); // to make batch requests
  txObject.encodeABI = this.parent._encodeMethodABI.bind(txObject);
  txObject.estimateGas = this.parent._executeMethod.bind(txObject, 'estimate');

  if (args && this.method.inputs && args.length !== this.method.inputs.length) {
    if (this.nextMethod) {
      return this.nextMethod.apply(null, args);
    }
    throw errors.InvalidNumberOfParams(args.length, this.method.inputs.length, this.method.name);
  }

  txObject.arguments = args || [];
  txObject._method = this.method;
  txObject._parent = this.parent;
  txObject._ethAccounts = this.parent.constructor._ethAccounts || this._ethAccounts;

  if (this.deployData) {
    txObject._deployData = this.deployData;
  }

  return txObject;
};


/**
    * Generates the options for the execute call
    *
    * @method _processExecuteArguments
    * @param {Array} args
    * @param {Promise} defer
    */
Contract.prototype._processExecuteArguments = function _processExecuteArguments(args, defer) {
  var processedArgs = {};

  processedArgs.type = args.shift();

  // get the callback
  processedArgs.callback = this._parent._getCallback(args);

  // get block number to use for call
  if (processedArgs.type === 'call' && args[args.length - 1] !== true && (_.isString(args[args.length - 1]) || isFinite(args[args.length - 1])))
  processedArgs.defaultBlock = args.pop();

  // get the options
  processedArgs.options = _.isObject(args[args.length - 1]) ? args.pop() : {};

  // get the generateRequest argument for batch requests
  processedArgs.generateRequest = args[args.length - 1] === true ? args.pop() : false;

  processedArgs.options = this._parent._getOrSetDefaultOptions(processedArgs.options);
  processedArgs.options.data = this.encodeABI();

  // add contract address
  if (!this._deployData && !this._parent.options.address)
  throw new Error('This contract object doesn\'t have address set yet, please set an address first.');

  if (!this._deployData)
  processedArgs.options.to = this._parent.options.address;

  // return error, if no "data" is specified
  if (!processedArgs.options.data)
  return utils._fireError(new Error('Couldn\'t find a matching contract method, or the number of parameters is wrong.'), defer.eventEmitter, defer.reject, processedArgs.callback);

  return processedArgs;
};

/**
    * Executes a call, transact or estimateGas on a contract function
    *
    * @method _executeMethod
    * @param {String} type the type this execute function should execute
    * @param {Boolean} makeRequest if true, it simply returns the request parameters, rather than executing it
    */
Contract.prototype._executeMethod = /*#__PURE__*/function () {var _executeMethod2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {var args,defer,payload,ret,result,addrNonce,_args = arguments;return _regenerator.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            // var _this = this,
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            args = this._parent._processExecuteArguments.call(this, Array.prototype.slice.call(_args), defer),
            defer = promiEvent(args.type !== 'send');
            // ethAccounts = _this.constructor._ethAccounts || _this._ethAccounts

            // simple return request for batch requests
            if (!args.generateRequest) {_context.next = 7;break;}

            payload = {
              params: [formatters.inputCallFormatter.call(this._parent, args.options)],
              callback: args.callback };


            if (args.type === 'call') {
              payload.params.push(formatters.inputDefaultBlockNumberFormatter.call(this._parent, args.defaultBlock));
              payload.method = 'eth_call';
              payload.format = this._parent._decodeMethodReturn.bind(null, this._method.outputs);
            } else {
              payload.method = 'eth_sendTransaction';
            }return _context.abrupt("return",

            payload);case 7:_context.t0 =



            args.type;_context.next = _context.t0 ===
















            'call' ? 10 : _context.t0 ===




























            'send' ? 14 : 25;break;case 10:_context.next = 12;return this._parent.constructor.feature.callContract({ from: args.options.from || this._parent.constructor._from, to: args.options.to, data: args.options.data.slice(2), // remove '0x' prefix
              height: 0, timeout: 0 });case 12:ret = _context.sent;return _context.abrupt("return", this._parent._decodeMethodReturn(this._method.outputs, '0x' + ret.result /* add '0x' prefix */));case 14:if (

            args.options.privateKey || this._parent.constructor._privateKey) {_context.next = 16;break;}return _context.abrupt("return",
            utils._fireError(new Error('No privateKey specified in neither the given options, nor the default options.'), defer.eventEmitter, defer.reject, args.callback));case 16:if (



            args.options.from || this._parent.constructor._from) {_context.next = 18;break;}return _context.abrupt("return",
            utils._fireError(new Error('No "from" address specified in neither the given options, nor the default options.'), defer.eventEmitter, defer.reject, args.callback));case 18:if (!(


            _.isBoolean(this._method.payable) && !this._method.payable && args.options.value && args.options.value > 0)) {_context.next = 20;break;}return _context.abrupt("return",
            utils._fireError(new Error('Can not send value to non-payable contract method or constructor'), defer.eventEmitter, defer.reject, args.callback));case 20:_context.next = 22;return (






























































              this._parent.constructor.api.getNonce(this._parent.constructor._from));case 22:result = _context.sent;
            // + is to convert to number
            addrNonce = +result.nonce;return _context.abrupt("return",
            this._parent.constructor.feature.makeContractTxByPrivKey({
              from: args.options.from || this._parent.constructor._from,
              to: args.options.to,
              amount: args.options.value || 0,
              gasLimit: args.options.gasLimit || 2000000,
              nonce: addrNonce + 1,
              isDeploy: false,
              data: args.options.data.slice(2) // remove '0x' prefix
            },
            args.options.privateKey || this._parent.constructor._privateKey));case 25:case "end":return _context.stop();}}}, _callee, this);}));function _executeMethod() {return _executeMethod2.apply(this, arguments);}return _executeMethod;}();








module.exports = Contract;