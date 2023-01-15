export abstract class UrlResource {
  abstract original: string;
}

export class HttpUrl extends UrlResource {
  original: string;
  constructor(original: string) {
    super();
    this.original = original;
  }
}

export class SchemaUrl extends UrlResource {
  original: string;
  gateway: string;
  schema: string;
  path: string;
  constructor(original: string, gateway: string, schema: string, path: string) {
    super();
    this.original = original;
    this.gateway = gateway;
    this.schema = schema;
    this.path = path;
  }
  toSchemaUrl() {
    return `${this.schema}://${this.path}`;
  }
}

export const IPFS = 'ipfs',
  IPFS_PREFIX = `${IPFS}:/`,
  IPFS_PATH_PART = `/${IPFS_PREFIX}/`;

export class IpfsUrl extends UrlResource {
  original: string;
  originalGateway: string | null;
  path: string;
  static readonly IPFS = IPFS;
  static readonly IPFS_PREFIX = IPFS_PREFIX;
  static readonly IPFS_PATH_PART = IPFS_PATH_PART;
  constructor(original: string, path: string, originalGateway?: string) {
    super();
    this.original = original;
    this.originalGateway = originalGateway;
    this.path = path;
  }
  toSchemaUrl() {
    return `ipfs://${this.path}`;
  }
}
