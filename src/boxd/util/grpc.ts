import grpc from 'grpc'
import protoLoader from '@grpc/proto-loader'

/* load protobuf file */
const packageDefinition = protoLoader.loadSync('../../protobuf/web.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const hello_proto = grpc.loadPackageDefinition(packageDefinition).rpcpb
// console.log('hello_proto.WebApi :', hello_proto.WebApi)

export default class Grpc {
  protected path

  public constructor(path) {
    this.path = path
  }

  public connect(param) {
    // make client
    const client = new hello_proto.WebApi(
      this.path,
      grpc.credentials.createInsecure()
    )

    // connecting
    return new Promise(resolve => {
      const stream = client.Connect()
      // console.log('stream :', stream)

      stream.on('data', data => {
        console.log('[Connect] Data :', data)
      })
      stream.on('end', () => {
        console.log('[Connect] End')
        resolve()
      })

      stream.write(param)
    })
  }
}
