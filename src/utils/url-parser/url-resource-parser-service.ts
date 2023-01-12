import { UrlResource } from './dto/url-parser.dto';

export interface UrlResourceParser<T extends UrlResource> {
  parse(url: string): T | null;
}
