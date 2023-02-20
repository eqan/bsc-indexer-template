import { ConfigService } from '@nestjs/config';

interface SignatureData {
  v: number;
  r: Uint8Array;
  s: Uint8Array;
}

export function toBinary(data: SignatureData): Uint8Array {
  return Uint8Array.from([...data.r, ...data.s, data.v]);
}

export function toSignatureData(data: Uint8Array): SignatureData {
  const r = data.slice(0, 32);
  const s = data.slice(32, 64);
  const v = data[64];

  return { v, r, s };
}

export function fixV(data: SignatureData): SignatureData {
  const { v } = data;
  const config = new ConfigService();
  const chainId = config.get('chainId');
  return {
    v: v + chainId * 2 + 8,
    r: data.r,
    s: data.s,
  };
}

export function convertDataToBinary(hashedData: string): Uint8Array {
  const encoder = new TextEncoder();
  const data = encoder.encode(hashedData);
  const signatureData = toSignatureData(data);
  const fixVData = fixV(signatureData);
  return toBinary(fixVData);
}
