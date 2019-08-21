import path from 'path'
import grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

/* load protobuf file */
const packageDefinition = protoLoader.loadSync('web.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [path.join(__dirname, '../../protobuf')]
})

const grpc_object = grpc.loadPackageDefinition(packageDefinition).rpcpb

export default class Grpc {
  protected path

  public constructor(path) {
    this.path = path
  }

  public connect(param) {
    // make client
    const client = new grpc_object['WebApi'](
      this.path,
      grpc.credentials.createInsecure()
    )

    // connection
    return new Promise(resolve => {
      const stream = client.Connect()
      // console.log('stream :', stream)

      // connecting
      stream.on('data', data => {
        console.log('[Connect] Data :', data)
      })

      // ended
      stream.on('end', () => {
        console.log('[Connect] End')
        resolve()
      })

      // try
      stream.write(param)
    })
  }
}
