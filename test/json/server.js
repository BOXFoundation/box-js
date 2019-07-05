/* eslint-disable @typescript-eslint/no-var-requires */
var basepb = require('./messages_pb')
console.log(basepb)

var message = new basepb.SearchRequest()
console.log(message)

message.setName('TS')
message.setPassword('123456')

var bytes = message.serializeBinary() //对象序列化
console.log(bytes)