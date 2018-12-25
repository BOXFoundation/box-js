// Type definitions for boxdjs 0.1.0
import bitcore from 'bitcore-lib';

export interface cryptoJSON {
  id: string;
  address: string;
  crypto: {
    ciphertext: string;
    cipher: string;
    cipherparams: {
      iv: string;
    };
    mac: string;
    kdfparams: {
      salt: string;
      dklen: number;
      n: number;
      r: number;
      p: number;
    };
  };
}

export class Wallet {
  readonly walletList: object;

  unlockPrivateKeyWithPassphrase(
    cryptoJSON: cryptoJSON,
    password: string
  ): string;

  createWallet(
    password: string
  ): { cryptoJSON: cryptoJSON; privateKey: bitcore.PrivateKey };

  getCrypto(privateKey: bitcore.PrivateKey, password: string): cryptoJSON;

  addToWalletList(cryptoJSON: cryptoJSON, otherInfo?: object): null;

  listWallets(): string[];
}
