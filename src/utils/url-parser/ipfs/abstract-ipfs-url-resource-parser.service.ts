import { Injectable } from '@nestjs/common';
import { removeLeadingSlashes } from 'src/common/utils.common';
import { IpfsUrl } from '../dto/url-parser.dto';
import { UrlResourceParser } from '../url-resource-parser-service';

@Injectable()
export class AbstractIpfsUrlResourceParser
  implements UrlResourceParser<IpfsUrl>
{
  private readonly IPFS_PREFIXES = [
    'ipfs:///ipfs/',
    'ipfs://ipfs/',
    'ipfs:/ipfs/',
    'ipfs:',
  ];

  parse(url: string): IpfsUrl {
    if (url.length < 'ipfs:'.length) {
      return null;
    }

    const potentialIpfsPrefix = url.substring(0, 'ipfs:'.length).toLowerCase();

    if (potentialIpfsPrefix !== 'ipfs:') {
      return null;
    }

    const lowerCaseIpfsPrefixUri = removeLeadingSlashes(
      `ipfs:${url.substring('ipfs:'.length)}`,
    );

    for (const prefix of this.IPFS_PREFIXES) {
      if (lowerCaseIpfsPrefixUri.startsWith(prefix)) {
        const path = removeLeadingSlashes(
          lowerCaseIpfsPrefixUri.substring(prefix.length),
        );
        return new IpfsUrl(url, path, null);
      }
    }

    return null;
  }
}
