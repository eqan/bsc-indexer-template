import { Injectable } from '@nestjs/common';
import { isCID } from 'src/common/utils.common';
import { IpfsUrl } from '../dto/url-parser.dto';
import { UrlResourceParser } from '../url-resource-parser-service';

@Injectable()
export class CidUrlResourceParser implements UrlResourceParser<IpfsUrl> {
  parse(url: string): IpfsUrl | null {
    const cid = url.substring(0, url.indexOf('/'));
    if (isCID(cid)) {
      return new IpfsUrl(url, url, null);
    }
    return null;
  }
}
