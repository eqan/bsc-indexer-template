import { Injectable } from '@nestjs/common';
import { IpfsUrl } from '../dto/url-parser.dto';
import { UrlResourceParser } from '../url-resource-parser-service';
import { isCID, removeLeadingSlashes } from 'src/common/utils.common';
@Injectable()
export class ForeignIpfsUrlResourceParser
  implements UrlResourceParser<IpfsUrl>
{
  parse(url: string): IpfsUrl {
    const ipfsPathIndex = this.getIpfsPathIndex(url);
    if (ipfsPathIndex === null) {
      return null;
    }

    const pathEnd = removeLeadingSlashes(
      url.substring(ipfsPathIndex + '/ipfs/'.length),
    );

    const cid = pathEnd.substring(0, pathEnd.indexOf('/'));
    if (!isCID(cid)) {
      return null;
    }

    return new IpfsUrl(url, url.substring(0, ipfsPathIndex), pathEnd);
  }

  private getIpfsPathIndex(url: string): number | null {
    const ipfsPathIndex = url.lastIndexOf('/ipfs/');
    if (ipfsPathIndex < 0) {
      return null;
    }
    return ipfsPathIndex;
  }
}
