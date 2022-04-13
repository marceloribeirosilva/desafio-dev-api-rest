import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('accounts')
class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  agency: string;

  @Column()
  cpf: string;

  @Column()
  balance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Account;
