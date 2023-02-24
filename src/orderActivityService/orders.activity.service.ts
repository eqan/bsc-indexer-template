import { Injectable } from '@nestjs/common';
import { CaptureSpan } from 'src/rarible/core/apm/capture-span.decorator';
import { SpanType } from 'src/rarible/core/apm/span-type.enum';
import { ExchangeHistoryRepository } from 'src/rarible/protocol/order/core/repository/exchange-history.repository';
import { ActivityExchangeHistoryFilter } from 'src/rarible/protocol/order/core/repository/exchange/activity-exchange-history.filter';
import { OrderVersionRepository } from 'src/rarible/protocol/order/core/repository/order-version.repository';
import { ActivityOrderVersionFilter } from 'src/rarible/protocol/order/core/repository/order/activity-order-version.filter';
import { PoolHistoryRepository } from 'src/rarible/protocol/order/core/repository/pool-history.repository';
import { ActivitySort } from 'src/rarible/protocol/order/core/model/activity-sort.enum';
import { OrderActivityResult } from 'src/rarible/protocol/order/core/model/order-activity-result.model';
import { PoolActivityResult } from 'src/rarible/protocol/order/core/model/pool-activity-result.model';
import { ActivityResult } from 'src/rarible/protocol/order/core/model/activity-result.model';
import { ObjectId } from 'bson';

@Injectable()
export class OrderActivityService {
  constructor(
    private readonly exchangeHistoryRepository: ExchangeHistoryRepository,
    private readonly orderVersionRepository: OrderVersionRepository,
    private readonly poolHistoryRepository: PoolHistoryRepository,
  ) {}

  @CaptureSpan(SpanType.APP)
  async search(
    historyFilters: ActivityExchangeHistoryFilter[],
    versionFilters: ActivityOrderVersionFilter[],
    sort: ActivitySort,
    size: number,
  ): Promise<OrderActivityResult[]> {
    const histories = await Promise.all(
      historyFilters.map((filter) =>
        this.exchangeHistoryRepository
          .searchActivity(filter)
          .then((activity) =>
            activity.map((a) => new OrderActivityResult.History(a)),
          ),
      ),
    );
    const versions = await Promise.all(
      versionFilters.map((filter) =>
        this.orderVersionRepository
          .search(filter)
          .then((version) =>
            version.map((v) => new OrderActivityResult.Version(v)),
          ),
      ),
    );
    return (
      await ActivityResult.mergeOrdered(
        ActivityResult.comparator(sort),
        [...histories, ...versions],
        size,
      )
    ).map((activityResult) => activityResult as OrderActivityResult);
  }

  @CaptureSpan(SpanType.APP)
  async searchRight(
    historyFilter: ActivityExchangeHistoryFilter,
    sort: ActivitySort,
    size: number,
  ): Promise<ObjectId[]> {
    return this.exchangeHistoryRepository
      .searchShortActivity(historyFilter)
      .then((activity) => activity.map((a) => a.id))
      .then((ids) => ids.slice(0, size));
  }

  @CaptureSpan(SpanType.APP)
  async findByIds(ids: ObjectId[]): Promise<OrderActivityResult[]> {
    const histories = await this.exchangeHistoryRepository
      .findByIds(ids)
      .then((activity) =>
        activity.map((a) => new OrderActivityResult.History(a)),
      );
    const versions = await this.orderVersionRepository
      .findByIds(ids)
      .then((version) =>
        version.map((v) => new OrderActivityResult.Version(v)),
      );
    const pools = await this.poolHistoryRepository
      .findByIds(ids)
      .then((activity) =>
        activity.map(
          (a) =>
            new PoolActivityResult.History(a.toReversedEthereumLogRecord()),
        ),
      );
    return (
      await ActivityResult.merge([...histories, ...versions, ...pools])
    ).map((activityResult) => activityResult as OrderActivityResult);
  }
}
