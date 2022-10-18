import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
/*
    @Example: Following is the format example
    "transactionHash": "0x74fd40687d29f2ac584c14b46ad871d82e0fbe3332a2679370b1117c4fac0e57",
    "blockHash": "0xbd49cf6e7aad7c7e693ea675048033bfdfdea9665374de27283ee045ba7c9b91",
    "blockNumber": 10467061,
    "logIndex": 21
*/

@ObjectType()
@Entity('BlockChainInfo')
export class BlockChainInfo {
  @Field()
  @Column({type: 'text'})
  transactionHash: string;

  @Field()
  @Column({type: 'text'})
  blockHash: string;

  @Field()
  @Column({type: 'int'})
  blockNumber: Number;

  @Field()
  @Column({type: 'int'})
  logIndex: Number;
}
