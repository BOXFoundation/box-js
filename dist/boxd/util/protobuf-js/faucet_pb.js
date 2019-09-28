"use strict"; /**
               * @fileoverview
               * @enhanceable
               * @suppress {messageConventions} JS Compiler reports an error if a variable or
               *     field starts with 'MSG_' and isn't a translatable message.
               * @public
               */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.rpcpb.ClaimReq', null, global);
goog.exportSymbol('proto.rpcpb.ClaimResp', null, global);
/**
                                                           * Generated by JsPbCodeGenerator.
                                                           * @param {Array=} opt_data Optional initial data array, typically from a
                                                           * server response, or constructed directly in Javascript. The array is used
                                                           * in place and becomes part of the constructed object. It is not cloned.
                                                           * If no data is provided, the constructed object will be empty, but still
                                                           * valid.
                                                           * @extends {jspb.Message}
                                                           * @constructor
                                                           */
proto.rpcpb.ClaimReq = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rpcpb.ClaimReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
                               * @public
                               * @override
                               */
  proto.rpcpb.ClaimReq.displayName = 'proto.rpcpb.ClaimReq';
}
/**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */
proto.rpcpb.ClaimResp = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.rpcpb.ClaimResp, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
                               * @public
                               * @override
                               */
  proto.rpcpb.ClaimResp.displayName = 'proto.rpcpb.ClaimResp';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
                                       * Creates an object representation of this proto suitable for use in Soy templates.
                                       * Field names that are reserved in JavaScript and will be renamed to pb_name.
                                       * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
                                       * For the list of reserved names please see:
                                       *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
                                       * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
                                       *     for transitional soy proto support: http://goto/soy-param-migration
                                       * @return {!Object}
                                       */
  proto.rpcpb.ClaimReq.prototype.toObject = function (opt_includeInstance) {
    return proto.rpcpb.ClaimReq.toObject(opt_includeInstance, this);
  };


  /**
      * Static version of the {@see toObject} method.
      * @param {boolean|undefined} includeInstance Whether to include the JSPB
      *     instance for transitional soy proto support:
      *     http://goto/soy-param-migration
      * @param {!proto.rpcpb.ClaimReq} msg The msg instance to transform.
      * @return {!Object}
      * @suppress {unusedLocalVariables} f is only used for nested messages
      */
  proto.rpcpb.ClaimReq.toObject = function (includeInstance, msg) {
    var f,obj = {
      addr: jspb.Message.getFieldWithDefault(msg, 1, ""),
      amount: jspb.Message.getFieldWithDefault(msg, 2, 0) };


    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}


/**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.rpcpb.ClaimReq}
   */
proto.rpcpb.ClaimReq.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rpcpb.ClaimReq();
  return proto.rpcpb.ClaimReq.deserializeBinaryFromReader(msg, reader);
};


/**
    * Deserializes binary data (in protobuf wire format) from the
    * given reader into the given message object.
    * @param {!proto.rpcpb.ClaimReq} msg The message object to deserialize into.
    * @param {!jspb.BinaryReader} reader The BinaryReader to use.
    * @return {!proto.rpcpb.ClaimReq}
    */
proto.rpcpb.ClaimReq.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */reader.readString();
        msg.setAddr(value);
        break;
      case 2:
        var value = /** @type {number} */reader.readUint64();
        msg.setAmount(value);
        break;
      default:
        reader.skipField();
        break;}

  }
  return msg;
};


/**
    * Serializes the message to binary data (in protobuf wire format).
    * @return {!Uint8Array}
    */
proto.rpcpb.ClaimReq.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.rpcpb.ClaimReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
    * Serializes the given message to binary data (in protobuf wire
    * format), writing to the given BinaryWriter.
    * @param {!proto.rpcpb.ClaimReq} message
    * @param {!jspb.BinaryWriter} writer
    * @suppress {unusedLocalVariables} f is only used for nested messages
    */
proto.rpcpb.ClaimReq.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
    1,
    f);

  }
  f = message.getAmount();
  if (f !== 0) {
    writer.writeUint64(
    2,
    f);

  }
};


/**
    * optional string addr = 1;
    * @return {string}
    */
proto.rpcpb.ClaimReq.prototype.getAddr = function () {
  return (/** @type {string} */jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.rpcpb.ClaimReq.prototype.setAddr = function (value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
    * optional uint64 amount = 2;
    * @return {number}
    */
proto.rpcpb.ClaimReq.prototype.getAmount = function () {
  return (/** @type {number} */jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.rpcpb.ClaimReq.prototype.setAmount = function (value) {
  jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
                                       * Creates an object representation of this proto suitable for use in Soy templates.
                                       * Field names that are reserved in JavaScript and will be renamed to pb_name.
                                       * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
                                       * For the list of reserved names please see:
                                       *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
                                       * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
                                       *     for transitional soy proto support: http://goto/soy-param-migration
                                       * @return {!Object}
                                       */
  proto.rpcpb.ClaimResp.prototype.toObject = function (opt_includeInstance) {
    return proto.rpcpb.ClaimResp.toObject(opt_includeInstance, this);
  };


  /**
      * Static version of the {@see toObject} method.
      * @param {boolean|undefined} includeInstance Whether to include the JSPB
      *     instance for transitional soy proto support:
      *     http://goto/soy-param-migration
      * @param {!proto.rpcpb.ClaimResp} msg The msg instance to transform.
      * @return {!Object}
      * @suppress {unusedLocalVariables} f is only used for nested messages
      */
  proto.rpcpb.ClaimResp.toObject = function (includeInstance, msg) {
    var f,obj = {
      code: jspb.Message.getFieldWithDefault(msg, 1, 0),
      message: jspb.Message.getFieldWithDefault(msg, 2, ""),
      hash: jspb.Message.getFieldWithDefault(msg, 3, "") };


    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}


/**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.rpcpb.ClaimResp}
   */
proto.rpcpb.ClaimResp.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rpcpb.ClaimResp();
  return proto.rpcpb.ClaimResp.deserializeBinaryFromReader(msg, reader);
};


/**
    * Deserializes binary data (in protobuf wire format) from the
    * given reader into the given message object.
    * @param {!proto.rpcpb.ClaimResp} msg The message object to deserialize into.
    * @param {!jspb.BinaryReader} reader The BinaryReader to use.
    * @return {!proto.rpcpb.ClaimResp}
    */
proto.rpcpb.ClaimResp.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {number} */reader.readInt32();
        msg.setCode(value);
        break;
      case 2:
        var value = /** @type {string} */reader.readString();
        msg.setMessage(value);
        break;
      case 3:
        var value = /** @type {string} */reader.readString();
        msg.setHash(value);
        break;
      default:
        reader.skipField();
        break;}

  }
  return msg;
};


/**
    * Serializes the message to binary data (in protobuf wire format).
    * @return {!Uint8Array}
    */
proto.rpcpb.ClaimResp.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.rpcpb.ClaimResp.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
    * Serializes the given message to binary data (in protobuf wire
    * format), writing to the given BinaryWriter.
    * @param {!proto.rpcpb.ClaimResp} message
    * @param {!jspb.BinaryWriter} writer
    * @suppress {unusedLocalVariables} f is only used for nested messages
    */
proto.rpcpb.ClaimResp.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getCode();
  if (f !== 0) {
    writer.writeInt32(
    1,
    f);

  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
    2,
    f);

  }
  f = message.getHash();
  if (f.length > 0) {
    writer.writeString(
    3,
    f);

  }
};


/**
    * optional int32 code = 1;
    * @return {number}
    */
proto.rpcpb.ClaimResp.prototype.getCode = function () {
  return (/** @type {number} */jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.rpcpb.ClaimResp.prototype.setCode = function (value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
    * optional string message = 2;
    * @return {string}
    */
proto.rpcpb.ClaimResp.prototype.getMessage = function () {
  return (/** @type {string} */jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.rpcpb.ClaimResp.prototype.setMessage = function (value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
    * optional string hash = 3;
    * @return {string}
    */
proto.rpcpb.ClaimResp.prototype.getHash = function () {
  return (/** @type {string} */jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.rpcpb.ClaimResp.prototype.setHash = function (value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


goog.object.extend(exports, proto.rpcpb);