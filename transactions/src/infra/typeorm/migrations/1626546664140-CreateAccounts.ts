import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAccounts1626546664140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
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
            type: 'varchar',
            isUnique: true
          },
          {
            name: 'balance',
            type: 'decimal'
          },
          {
            name: 'active',
            type: 'boolean'
          },
          {
            name: 'block',
            type: 'boolean'
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
    await queryRunner.dropTable('accounts');
  }
}
