import { Injectable } from '@nestjs/common';
import {
  HttpUrl,
  IpfsUrl,
  SchemaUrl,
  UrlResource,
} from '../url-parser/dto/url-parser.dto';

@Injectable()
export class UrlResolver {
  resolveInternalUrl(resource: UrlResource): string {
    return this.resolveInternal(resource, false);
  }

  resolvePublicUrl(resource: UrlResource): string {
    return this.resolveInternal(resource, true);
  }

  private resolveInternal(resource: UrlResource, isPublic: boolean): string {
    if (resource instanceof HttpUrl) {
      return resource.original;
    } else if (resource instanceof SchemaUrl) {
      return `${resource.gateway}/${resource.path}`;
    } else if (resource instanceof IpfsUrl) {
      return resource.original;
    } else {
      throw new Error('Unsupported resolving for resolver class');
    }
  }
}
