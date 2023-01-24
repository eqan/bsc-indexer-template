import { Injectable, Logger } from '@nestjs/common';
import { FeatureFlags } from 'src/core/ordersIndexerProperties/properties';
import { Address, toAddress } from '@rarible/types';
import { AssetType } from 'src/orders/dto/asset-type.dto';
import { Contract } from '@ethersproject/contracts';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { CollectionIface } from 'src/common/utils.common';

@Injectable()
export class ApproveService {
  constructor(
    private featureFlags: FeatureFlags,
    private rpcProvider: RpcProvider,
    private readonly logger = new Logger('approve-service'),
  ) {}

  async checkOnChainApprove(
    maker: string,
    make: AssetType,
    collection: string,
  ): Promise<boolean> {
    if (!make.nft || !this.featureFlags.checkOnChainApprove) return true;
    const onChainApprove = await this.checkOnChainApproveAndReturnResult(
      toAddress(maker),
      toAddress(collection),
    );
    return this.featureFlags.applyOnChainApprove ? onChainApprove : true;
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
