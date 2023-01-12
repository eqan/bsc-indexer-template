import { Injectable } from '@nestjs/common';
import { IpfsUrl } from '../dto/url-parser.dto';
import { AbstractIpfsUrlResourceParser } from './abstract-ipfs-url-resource-parser.service';
import { ForeignIpfsUrlResourceParser } from './foreign-ipfs-url-resource-parser.service';
import { CidUrlResourceParser } from './cid-url-resource-parser.service';
import { UrlResourceParser } from '../url-resource-parser-service';

@Injectable()
export class IpfsUrlResourceParser implements UrlResourceParser<IpfsUrl> {
  constructor(
    private readonly abstractIpfsUrlResourceParser: AbstractIpfsUrlResourceParser,
    private readonly foreignIpfsUrlResourceParser: ForeignIpfsUrlResourceParser,
    private readonly cidUrlResourceParser: CidUrlResourceParser,
  ) {}

  parse(url: string): IpfsUrl | null {
    const parsers = [
      this.abstractIpfsUrlResourceParser,
      this.foreignIpfsUrlResourceParser,
      this.cidUrlResourceParser,
    ];
    for (const parser of parsers) {
      const result = parser.parse(url);
      if (result !== null) {
        return result;
      }
    }
    return null;
  }
}
