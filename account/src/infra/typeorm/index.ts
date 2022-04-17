/* eslint-disable @typescript-eslint/no-explicit-any  */
import { createConnection } from 'typeorm';

const config: any = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  migrationsTableName: 'migrations',
  entities: ['./src/infra/typeorm/entities/*.ts'],
  migrations: ['./src/infra/typeorm/migrations/*.ts'],
  cli: {
    migrationsDir: './src/infra/typeorm/migrations'
  }
};

createConnection(config);
