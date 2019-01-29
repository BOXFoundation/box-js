module.exports = {
  nested: {
    txpackage: {
      nested: {
        Transaction: {
          fields: {
            Version: {
              type: 'int32',
              id: 1
            },
            Vin: {
              rule: 'repeated',
              type: 'TxIn',
              id: 2
            },
            Vout: {
              rule: 'repeated',
              type: 'TxOut',
              id: 3
            },
            Data: {
              type: 'Data',
              id: 4
            },
            Magic: {
              type: 'uint32',
              id: 5
            },
            LockTime: {
              type: 'int64',
              id: 6
            }
          }
        },
        TxIn: {
          fields: {
            PrevOutPoint: {
              type: 'OutPoint',
              id: 1
            },
            ScriptSig: {
              type: 'bytes',
              id: 2
            },
            Sequence: {
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
            Hash: {
              type: 'bytes',
              id: 1
            },
            Index: {
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
