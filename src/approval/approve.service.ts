import { Injectable, Logger } from '@nestjs/common';
import { Address, toAddress } from '@rarible/types';
import { Contract } from '@ethersproject/contracts';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { CollectionIface } from 'src/common/utils.common';
import { AssetTypeInput } from 'src/orders/dto/nestedObjectsDto/asset.dto';
import { getFeatureFlags } from 'src/config/featureflag.config';

@Injectable()
export class ApproveService {
  constructor(private rpcProvider: RpcProvider) {}

  private readonly logger = new Logger('approve-service');
  async checkOnChainApprove(
    maker: string,
    make: AssetTypeInput,
    collection: string,
  ): Promise<boolean> {
    const featureFlags = getFeatureFlags();
    if (!make.tokenId || !featureFlags.checkOnChainApprove) return true;
    const onChainApprove = await this.checkOnChainApproveAndReturnResult(
      toAddress(maker),
      toAddress(collection),
    );
    return featureFlags.applyOnChainApprove ? onChainApprove : true;
  }

  async checkOnChainApproveAndReturnResult(
    owner: Address,
    collection: Address,
  ): Promise<boolean> {
    const contract = new Contract(
      collection,
      CollectionIface,
      this.rpcProvider.baseProvider,
    );
    const result = await contract.isApprovedForAll(owner, it).awaitFirst();
    if (!result) {
      this.logger.error(
        'Approval check result: owner={}, collection={}, operator={}, result={}',
        owner,
        collection,
        it,
        result,
      );
      return false;
    }
    return true;
  }
}
