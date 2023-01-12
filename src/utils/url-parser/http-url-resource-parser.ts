import { Injectable } from '@nestjs/common';
import { HttpUrl } from './dto/url-parser.dto';
import { UrlResourceParser } from './url-resource-parser-service';

@Injectable()
export class HttpUrlResourceParser implements UrlResourceParser<HttpUrl> {
  parse(url: string): HttpUrl {
    if (this.isHttpUrl(url)) {
      return new HttpUrl(url);
    }
    return null;
  }

  isHttpUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }
}
