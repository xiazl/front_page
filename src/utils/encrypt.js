import NodeRSA from 'node-rsa';

const publicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALPQgW4cIubBh9cYEYWQgyCh6Q41ySDm3jpCUc5AUrKxx1iLBInEqoAw8n6sULRtyPiVFi0HDw4iuNkNPG723n8CAwEAAQ\n' +
  '-----END PUBLIC KEY-----';

export default function encryptStr(text) {
  const key = new NodeRSA(publicKey);
  key.setOptions({ encryptionScheme: 'pkcs1' });
  const encrypted = key.encrypt(text, 'base64');
  return encrypted;
}
