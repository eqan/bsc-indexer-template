import { Injectable } from '@nestjs/common';
import { SchemaUrl } from './dto/url-parser.dto';
import { UrlResourceParser } from './url-resource-parser-service';
export interface SchemaMapping {
  schema: string;
  gateway: string;
}
@Injectable()
export class SchemaUrlResourceParser implements UrlResourceParser<SchemaUrl> {
  private readonly schemaMappings: SchemaMapping[] = [
    { schema: 'ar', gateway: 'https://arweave.net' },
  ];

  parse(url: string): SchemaUrl {
    const schemaEndIndex = url.indexOf('://');
    if (schemaEndIndex < 0) {
      return null;
    }
    const schema = url.substring(0, schemaEndIndex);
    const gateway = this.schemaMappings.find(
      (mapping) => mapping.schema === schema,
    )?.gateway;
    if (!gateway) {
      return null;
    }
    const path = url.substring(schemaEndIndex + '://'.length);

    return new SchemaUrl(url, gateway, schema, path);
  }
}
