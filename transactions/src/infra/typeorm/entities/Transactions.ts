import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('transactions')
class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  agency: string;

  @Column()
  cpf: string;

  @Column()
  current_balance: number;

  @Column()
  final_balance: number;

  @Column()
  type: string;

  @Column()
  value_transaction: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transactions;
