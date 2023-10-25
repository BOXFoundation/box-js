/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf')
var goog = jspb
var global = Function('return this')()

var block_pb = require('./block_pb.js')
goog.object.extend(proto, block_pb)
goog.exportSymbol('proto.rpcpb.BaseResponse', null, global)
goog.exportSymbol('proto.rpcpb.Utxo', null, global)
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
proto.rpcpb.Utxo = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.rpcpb.Utxo, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.rpcpb.Utxo.displayName = 'proto.rpcpb.Utxo'
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
proto.rpcpb.BaseResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.rpcpb.BaseResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.rpcpb.BaseResponse.displayName = 'proto.rpcpb.BaseResponse'
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
  proto.rpcpb.Utxo.prototype.toObject = function (opt_includeInstance) {
    return proto.rpcpb.Utxo.toObject(opt_includeInstance, this)
  }


  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.rpcpb.Utxo} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.rpcpb.Utxo.toObject = function (includeInstance, msg) {
    var f, obj = {
      outPoint: (f = msg.getOutPoint()) && block_pb.OutPoint.toObject(includeInstance, f),
      txOut: (f = msg.getTxOut()) && block_pb.TxOut.toObject(includeInstance, f),
      blockHeight: jspb.Message.getFieldWithDefault(msg, 3, 0),
      isSpent: jspb.Message.getFieldWithDefault(msg, 4, false)
    }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.rpcpb.Utxo}
 */
proto.rpcpb.Utxo.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.rpcpb.Utxo
  return proto.rpcpb.Utxo.deserializeBinaryFromReader(msg, reader)
}


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rpcpb.Utxo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rpcpb.Utxo}
 */
proto.rpcpb.Utxo.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new block_pb.OutPoint
        reader.readMessage(value, block_pb.OutPoint.deserializeBinaryFromReader)
        msg.setOutPoint(value)
        break
      case 2:
        var value = new block_pb.TxOut
        reader.readMessage(value, block_pb.TxOut.deserializeBinaryFromReader)
        msg.setTxOut(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockHeight(value)
        break
      case 4:
        var value = /** @type {boolean} */ (reader.readBool())
        msg.setIsSpent(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.rpcpb.Utxo.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.rpcpb.Utxo.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rpcpb.Utxo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.rpcpb.Utxo.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getOutPoint()
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      block_pb.OutPoint.serializeBinaryToWriter
    )
  }
  f = message.getTxOut()
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      block_pb.TxOut.serializeBinaryToWriter
    )
  }
  f = message.getBlockHeight()
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    )
  }
  f = message.getIsSpent()
  if (f) {
    writer.writeBool(
      4,
      f
    )
  }
}


/**
 * optional corepb.OutPoint out_point = 1;
 * @return {?proto.corepb.OutPoint}
 */
proto.rpcpb.Utxo.prototype.getOutPoint = function () {
  return /** @type{?proto.corepb.OutPoint} */ (
    jspb.Message.getWrapperField(this, block_pb.OutPoint, 1))
}


/** @param {?proto.corepb.OutPoint|undefined} value */
proto.rpcpb.Utxo.prototype.setOutPoint = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}


/**
 * Clears the message field making it undefined.
 */
proto.rpcpb.Utxo.prototype.clearOutPoint = function () {
  this.setOutPoint(undefined)
}


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.rpcpb.Utxo.prototype.hasOutPoint = function () {
  return jspb.Message.getField(this, 1) != null
}


/**
 * optional corepb.TxOut tx_out = 2;
 * @return {?proto.corepb.TxOut}
 */
proto.rpcpb.Utxo.prototype.getTxOut = function () {
  return /** @type{?proto.corepb.TxOut} */ (
    jspb.Message.getWrapperField(this, block_pb.TxOut, 2))
}


/** @param {?proto.corepb.TxOut|undefined} value */
proto.rpcpb.Utxo.prototype.setTxOut = function (value) {
  jspb.Message.setWrapperField(this, 2, value)
}


/**
 * Clears the message field making it undefined.
 */
proto.rpcpb.Utxo.prototype.clearTxOut = function () {
  this.setTxOut(undefined)
}


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.rpcpb.Utxo.prototype.hasTxOut = function () {
  return jspb.Message.getField(this, 2) != null
}


/**
 * optional uint32 block_height = 3;
 * @return {number}
 */
proto.rpcpb.Utxo.prototype.getBlockHeight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}


/** @param {number} value */
proto.rpcpb.Utxo.prototype.setBlockHeight = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}


/**
 * optional bool is_spent = 4;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.rpcpb.Utxo.prototype.getIsSpent = function () {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 4, false))
}


/** @param {boolean} value */
proto.rpcpb.Utxo.prototype.setIsSpent = function (value) {
  jspb.Message.setProto3BooleanField(this, 4, value)
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
  proto.rpcpb.BaseResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.rpcpb.BaseResponse.toObject(opt_includeInstance, this)
  }


  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.rpcpb.BaseResponse} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.rpcpb.BaseResponse.toObject = function (includeInstance, msg) {
    var f, obj = {
      code: jspb.Message.getFieldWithDefault(msg, 1, 0),
      message: jspb.Message.getFieldWithDefault(msg, 2, "")
    }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.rpcpb.BaseResponse}
 */
proto.rpcpb.BaseResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.rpcpb.BaseResponse
  return proto.rpcpb.BaseResponse.deserializeBinaryFromReader(msg, reader)
}


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rpcpb.BaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rpcpb.BaseResponse}
 */
proto.rpcpb.BaseResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setCode(value)
        break
      case 2:
        var value = /** @type {string} */ (reader.readString())
        msg.setMessage(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.rpcpb.BaseResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.rpcpb.BaseResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rpcpb.BaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.rpcpb.BaseResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getCode()
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    )
  }
  f = message.getMessage()
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    )
  }
}


/**
 * optional int32 code = 1;
 * @return {number}
 */
proto.rpcpb.BaseResponse.prototype.getCode = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}


/** @param {number} value */
proto.rpcpb.BaseResponse.prototype.setCode = function (value) {
  jspb.Message.setProto3IntField(this, 1, value)
}


/**
 * optional string message = 2;
 * @return {string}
 */
proto.rpcpb.BaseResponse.prototype.getMessage = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""))
}


/** @param {string} value */
proto.rpcpb.BaseResponse.prototype.setMessage = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}


goog.object.extend(exports, proto.rpcpb)