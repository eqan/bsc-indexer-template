// --- Parse and Format Buffers ---

export const fromBuffer = (buffer: Buffer) => '0x' + buffer.toString('hex');

export const toBuffer = (hexValue: string) =>
  Buffer.from(hexValue.slice(2), 'hex');

// --- Regex ---

export const regex = {
  url: /(\b(https|http?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|/*])/,
  query: /(\{[a-z]*id\})/g,
  ipfs: /(^(ipfs:|ipns:)\/\/*)/,
};

// ---- returns true if url is base64 encoded

export const isBase64Encoded = (tokenURI: string) =>
  tokenURI?.split(',')[0] === 'data:application/json;base64' ? true : false;

// parses base64 to json

export const base64toJson = (tokenURI: string) =>
  JSON.parse(Buffer.from(tokenURI?.split(',')[1], 'base64').toString('ascii'));

export const ipfsDomain = 'https://ipfs.io/ipfs/';
