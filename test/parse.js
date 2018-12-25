import bitcore from 'bitcore-lib';

const str = '1253763c15ab327823c15dface658c7f269512987d750cb50d4d84094c63da6c';
const privateKey = bitcore.PrivateKey(str);

console.log('privateKey:', privateKey.toAddress().toString('hex'));
