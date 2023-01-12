import { Injectable } from '@nestjs/common';
import { UrlResource } from './dto/url-parser.dto';
import { HttpUrlResourceParser } from './http-url-resource-parser';
import { IpfsUrlResourceParser } from './ipfs/ipfs-url-resource-parser';
import { SchemaUrlResourceParser } from './schema-url-resource-parser';
// import { UrlResource } from './url-resource.model';
// import { IpfsUrlResourceParser } from './ipfs-url-resource-parser.service';
// import { SchemaUrlResourceParser } from './schema-url-resource-parser.service';
// import { HttpUrlResourceParser } from './http-url-resource-parser.service';

@Injectable()
export class UrlParser {
  private readonly QUOTES = new Set(['"', "'"]);
  private readonly resourceParsers;
  constructor(
    private readonly ipfsUrlResourceParser: IpfsUrlResourceParser,
    private readonly schemaUrlResourceParser: SchemaUrlResourceParser,
    private readonly httpUrlResourceParser: HttpUrlResourceParser,
  ) {
    this.resourceParsers = [
      ipfsUrlResourceParser,
      schemaUrlResourceParser,
      httpUrlResourceParser,
    ];
  }

  parse(url: string): UrlResource {
    const sanitized = this.sanitize(url);
    for (const parser of this.resourceParsers) {
      const parsed = parser.parse(sanitized);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  }

  private sanitize(url: string): string {
    let result = url.trim();
    while (
      result.length > 1 &&
      result[0] === result[result.length - 1] &&
      this.QUOTES.has(result[0])
    ) {
      result = result.substring(1, result.length - 1);
    }
    return result;
  }
}
