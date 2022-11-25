import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Data } from '../dto/nestedObjectsDto/data.object';
import { Make } from '../dto/nestedObjectsDto/make.dto';
import { OrderType } from './enums/order.type.enum';
import { OrderStatus } from './enums/orders.status.enum';

@ObjectType()
@Entity('Orders')
export class Orders {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
    nullable: false,
  })
  orderId: string;

  @Field()
  @Column({
    type: 'decimal',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  fill: number;

  @Field()
  @Column({
    type: 'enum',
    nullable: true,
    enumName: 'OrderStatus',
    enum: OrderStatus,
    default: OrderStatus.Active,
  })
  status: OrderStatus;

  @Field()
  @Column({
    type: 'int',
<<<<<<< Updated upstream
    nullable: true,
=======
    nullable: false,
>>>>>>> Stashed changes
  })
  makeStock: number;

  @Field()
  @Column({
    type: 'boolean',
<<<<<<< Updated upstream
    nullable: true,
=======
    nullable: false,
>>>>>>> Stashed changes
  })
  cancelled: boolean;

  @Field()
  @Column({
    type: 'timestamptz',
<<<<<<< Updated upstream
    nullable: true,
=======
    nullable: false,
>>>>>>> Stashed changes
  })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamptz',
<<<<<<< Updated upstream
    nullable: true,
=======
    nullable: false,
>>>>>>> Stashed changes
  })
  lastUpdatedAt: Date;

  @Field()
  @Column({
    type: 'text',
<<<<<<< Updated upstream
    nullable: true,
=======
    nullable: false,
>>>>>>> Stashed changes
  })
  maker: string;

  @Field(() => Make)
  @Column({
    type: 'jsonb',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  Make: {
    type: {
      type: OrderType;
      contract: string;
      tokenId: number;
    };
    value: number;
  };

  @Field(() => Make)
  @Column({
    type: 'jsonb',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  take: {
    type: {
      type: OrderType;
      contract: string;
      tokenId: number;
    };
    value: number;
  };

  @Field()
  @Column({
    type: 'text',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  salt: string;

  @Field(() => Data)
  @Column({
    type: 'json',
<<<<<<< Updated upstream
    nullable: true,
=======
    nullable: false,
>>>>>>> Stashed changes
  })
  data: {
    type: string;
    nullable: true;
    // payouts?: number[];
    originFees?: {
      account: string;
      value: number;
    };
  };

  @Field()
  @Column({
    type: 'timestamptz',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  startedAt?: Date;

  @Field()
  @Column({
    type: 'timestamptz',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  endedAt?: Date;

  @Field()
  @Column({
    type: 'boolean',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  optionalRoyalties?: boolean;

  @Field()
  @Column({
    type: 'timestamptz',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  dbUpdatedAt?: Date;

  @Field()
  @Column({
    type: 'decimal',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  makePrice?: number;

  @Field()
  @Column({
    type: 'decimal',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  takePrice?: number;

  @Field()
  @Column({
    type: 'decimal',
<<<<<<< Updated upstream
    nullable: true,
=======
>>>>>>> Stashed changes
  })
  makePriceUsed?: number;

  @Field()
  @Column({
    type: 'float',
    nullable: true,
  })
  takePriceUsed?: number;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  signature?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  taker?: string;
}
