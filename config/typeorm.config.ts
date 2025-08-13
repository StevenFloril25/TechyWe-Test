import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Product } from '../src/products/product.entity';
import { User } from '../src/users/user.entity';

export const typeOrmConfig = async (): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'changeme',
    database: process.env.DB_NAME || 'nest_products',
    entities: [User, Product],
    synchronize: true, 
    logging: false,
  };
};
