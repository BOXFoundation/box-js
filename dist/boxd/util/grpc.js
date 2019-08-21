"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var grpc_1 = __importDefault(require("grpc"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
/* load protobuf file */
var packageDefinition = protoLoader.loadSync('web.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [path_1.default.join(__dirname, '../../protobuf')]
});
var grpc_object = grpc_1.default.loadPackageDefinition(packageDefinition).rpcpb;
var Grpc = /** @class */ (function () {
    function Grpc(path) {
        this.path = path;
    }
    Grpc.prototype.connect = function (param) {
        // make client
        var client = new grpc_object['WebApi'](this.path, grpc_1.default.credentials.createInsecure());
        // connection
        return new Promise(function (resolve) {
            var stream = client.Connect();
            // console.log('stream :', stream)
            // connecting
            stream.on('data', function (data) {
                console.log('[Connect] Data :', data);
            });
            // ended
            stream.on('end', function () {
                console.log('[Connect] End');
                resolve();
            });
            // try
            stream.write(param);
        });
    };
    return Grpc;
}());
exports.default = Grpc;
