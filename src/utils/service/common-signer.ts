export class CommonSigner {
  fixSignature(signature: string): Uint8Array {
    if (signature.length === 130) {
      return new Uint8Array(Buffer.from(signature, 'hex'));
    }

    const v = signature.slice(128);
    const fixedV = this.fixV(v);
    const byteArray = new Uint8Array(65);
    byteArray[64] = fixedV;
    byteArray.set(new Uint8Array(Buffer.from(signature.slice(0, 128), 'hex')));
    return byteArray;
  }

  private fixV(v: string): number {
    return parseInt(v, 16) < 27 ? parseInt(v, 16) + 27 : parseInt(v, 16);
  }
}
