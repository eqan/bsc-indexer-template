import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// export type BaseEventParams = {
//   address: string;
//   block: number;
//   blockHash: string;
//   txHash: string;
//   txIndex: number;
//   logIndex: number;
//   timestamp: number;
//   batchIndex: number;
// };

@Entity('BaseEventParams')
export class BaseEventParams {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address: string;

  // @Column({
  //   type: 'int',
  //   nullable: true,
  // })
  // block: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  blockHash: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  txHash: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  txIndex: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  logIndex: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  timestamp: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  batchIndex: number;
}
