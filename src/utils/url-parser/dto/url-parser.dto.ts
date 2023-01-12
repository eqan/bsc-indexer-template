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

export class IpfsUrl extends UrlResource {
  original: string;
  originalGateway: string | null;
  path: string;
  static readonly IPFS = 'ipfs';
  static readonly IPFS_PREFIX = `${IpfsUrl.IPFS}:/`;
  static readonly IPFS_PATH_PART = `/${IpfsUrl.IPFS}/`;
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
