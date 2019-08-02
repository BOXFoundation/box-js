/* eslint-disable @typescript-eslint/no-var-requires */
// 加载grpc模块
var grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')

var packageDefinition = protoLoader.loadSync('../../protobuf/web.proto', {
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

  public varructor(host, port) {
    this.rpc_host = host
    this.rpc_port = port
  }
}
 */

// 主函数
function main() {
  // 创建客户端
  var client = new hello_proto.WebApi(
    '39.97.170.105:19151',
    grpc.credentials.createInsecure()
  )

  // 定义请求参数 使用附带参数如果有 如: node client.js 123
  // 调用接口方法
  return new Promise(resolve => {
    var stream = client.Connect()
    // console.log('stream :', stream)

    stream.on('data', data => {
      console.log('[Connect] Data :', data)
    })
    stream.on('end', () => {
      console.log('[Connect] End')
      resolve()
    })

    stream.write({
      type: 0
    })
  })
}

main()