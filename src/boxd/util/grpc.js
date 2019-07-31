/* eslint-disable @typescript-eslint/no-var-requires */
// 加载grpc模块
var grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
var PROTO_PATH = '../../protobuf/web.proto'
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })

// 加载包配置
var hello_proto = grpc.loadPackageDefinition(packageDefinition).rpcpb
console.log('hello_proto.WebApi :', hello_proto.WebApi)

/* export class Grpc {
  protected rpc_host
  protected rpc_port

  public constructor(host, port) {
    this.rpc_host = host
    this.rpc_port = port
  }
}
 */

// 主函数
function main() {
  // 创建客户端
  try {
    var client = new hello_proto.WebApi(
      '39.97.170.105:19151',
      grpc.credentials.createInsecure()
    )
    console.log('client :', client)
    const call = client.routeChat()
    call.on('data', function (note) {
      console.log('Got message "' + note.getMessage() + '" at ' +
        note.getLocation().getLatitude() + ', ' +
        note.getLocation().getLongitude())
    })

    // 定义请求参数 使用附带参数如果有 如: node client.js 123
    // 调用接口方法
    /*     client.Connect({
      type: 0
    }, function (err, response) {
      console.log('sayHello服务端返回 :', response.message)
    }) */
  } catch (err) {
    console.log('main Error :', err)
  }
}

main()