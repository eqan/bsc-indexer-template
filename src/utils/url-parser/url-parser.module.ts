import { Module } from '@nestjs/common';
import { HttpUrlResourceParser } from './http-url-resource-parser';
import { AbstractIpfsUrlResourceParser } from './ipfs/abstract-ipfs-url-resource-parser.service';
import { CidUrlResourceParser } from './ipfs/cid-url-resource-parser.service';
import { ForeignIpfsUrlResourceParser } from './ipfs/foreign-ipfs-url-resource-parser.service';
import { IpfsUrlResourceParser } from './ipfs/ipfs-url-resource-parser';
import { SchemaUrlResourceParser } from './schema-url-resource-parser';
import { UrlParser } from './url-parser-service';

@Module({
  imports: [],
  providers: [
    AbstractIpfsUrlResourceParser,
    ForeignIpfsUrlResourceParser,
    CidUrlResourceParser,
    IpfsUrlResourceParser,
    HttpUrlResourceParser,
    SchemaUrlResourceParser,
    UrlParser,
  ],
  exports: [UrlParser],
})
export class UrlParserModule {}
