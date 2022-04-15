import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactions1626546664140
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment'
          },
          {
            name: 'account',
            type: 'varchar'
          },
          {
            name: 'agency',
            type: 'varchar'
          },
          {
            name: 'cpf',
            type: 'varchar'
          },
          {
            name: 'current_balance',
            type: 'decimal'
          },
          {
            name: 'final_balance',
            type: 'decimal'
          },
          {
            name: 'type',
            type: 'varchar'
          },
          {
            name: 'value_transaction',
            type: 'decimal'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
