module.exports = {
  nested: {
    txpackage: {
      nested: {
        Transaction: {
          fields: {
            version: {
              type: 'int32',
              id: 1
            },
            vin: {
              rule: 'repeated',
              type: 'TxIn',
              id: 2
            },
            vout: {
              rule: 'repeated',
              type: 'TxOut',
              id: 3
            },
            data: {
              type: 'Data',
              id: 4
            },
            magic: {
              type: 'uint32',
              id: 5
            },
            lockTime: {
              type: 'int64',
              id: 6
            }
          }
        },
        TxIn: {
          fields: {
            prev_out_point: {
              type: 'OutPoint',
              id: 1
            },
            script_sig: {
              type: 'bytes',
              id: 2
            },
            sequence: {
              type: 'uint32',
              id: 3
            }
          }
        },
        TxOut: {
          fields: {
            value: {
              type: 'uint64',
              id: 1
            },
            script_pub_key: {
              type: 'bytes',
              id: 2
            }
          }
        },
        OutPoint: {
          fields: {
            hash: {
              type: 'bytes',
              id: 1
            },
            index: {
              type: 'uint32',
              id: 2
            }
          }
        },
        Data: {
          fields: {
            type: {
              type: 'int32',
              id: 1
            },
            content: {
              type: 'bytes',
              id: 2
            }
          }
        }
      }
    }
  }
};
