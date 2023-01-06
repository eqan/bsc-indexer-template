import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUsdPriceInput } from './dto/create-usd-price.input';
import { FilterUsdPriceInput } from './dto/filter-usd-price.input';
import { UpdateUsdPriceInput } from './dto/update-usd-price.input';
import { UsdPrice } from './entities/usd-price.entity';
import { UsdPricesService } from './usd-prices.service';

@Resolver(() => UsdPrice)
export class UsdPricesResolver {
  constructor(private readonly usdPricesService: UsdPricesService) {}

  @Mutation(() => UsdPrice)
  createUsdPrice(
    @Args('createUsdPriceInput') createUsdPriceInput: CreateUsdPriceInput,
  ) {
    return this.usdPricesService.create(createUsdPriceInput);
  }

  @Query(() => [UsdPrice], { name: 'usdPrices' })
  findAll() {
    return this.usdPricesService.index();
  }

  @Query(() => UsdPrice, { name: 'usdPrice' })
  findOne(
    @Args('filterUsdPriceInput') filterUsdPriceInput: FilterUsdPriceInput,
  ) {
    return this.usdPricesService.show(filterUsdPriceInput);
  }

  @Mutation(() => UsdPrice)
  updateUsdPrice(
    @Args('updateUsdPriceInput') updateUsdPriceInput: UpdateUsdPriceInput,
  ) {
    return this.usdPricesService.edit(updateUsdPriceInput.id);
  }

  @Mutation(() => UsdPrice)
  removeUsdPrice(@Args('id', { type: () => String }) id: string) {
    return this.usdPricesService.delete(id);
  }
}
