import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import {
  ConfigurationEntity,
  MachineElementEntity,
  MachineEntity,
  MaterialEntity,
  MaterialSupplierEntity,
  PartEntity,
  PartMaterialEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
  PurchaseOrderPaymentEntity,
  RequestForQuotationEntity,
  RequestForQuotationMaterialEntity,
  SupplierEntity,
} from './entities';
import {
  MachineElementResolver,
  MachineResolver,
  MaterialResolver,
  PartMaterialResolver,
  PartResolver,
  PurchaseOrderMaterialResolver,
  PurchaseOrderResolver,
  RequestForQuotationResolver,
  SupplierResolver,
} from './resolvers';
import {
  MachineElementLoader,
  MaterialLoader,
  PartMaterialLoader,
  PurchaseOrderMaterialLoader,
  PurchaseOrderPaymentLoader,
  RequestForQuotationMaterialLoader,
  SupplierLoader,
} from './loaders';
import RequestForQuotationMaterialResolver from './resolvers/request-for-quotation-material.resolver';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PDFService } from './services';

const entities = [
  ConfigurationEntity,
  MachineElementEntity,
  MachineEntity,
  MaterialEntity,
  MaterialSupplierEntity,
  PartEntity,
  PartMaterialEntity,
  PurchaseOrderEntity,
  PurchaseOrderMaterialEntity,
  PurchaseOrderPaymentEntity,
  RequestForQuotationEntity,
  RequestForQuotationMaterialEntity,
  SupplierEntity,
];
const resolvers = [
  MachineElementResolver,
  MachineResolver,
  MaterialResolver,
  PartMaterialResolver,
  PartResolver,
  PurchaseOrderMaterialResolver,
  PurchaseOrderResolver,
  RequestForQuotationMaterialResolver,
  RequestForQuotationResolver,
  SupplierResolver,
];
const loaders = [
  MachineElementLoader,
  MaterialLoader,
  PartMaterialLoader,
  PurchaseOrderMaterialLoader,
  PurchaseOrderPaymentLoader,
  RequestForQuotationMaterialLoader,
  SupplierLoader,
];
const services = [PDFService];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'assets'),
      serveStaticOptions: { index: false },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT as string),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        entities,
        synchronize: true,
        logging: true,
        migrations: ['dist/migrations/*.js'],
      }),
      dataSourceFactory: async options => {
        if (!options) {
          throw new Error('dataSourceFactory error');
        }

        const ds = new DataSource(options);
        await ds.initialize();

        if (process.env.NODE_ENV === 'development') {
          await ds.runMigrations();
        }

        return ds;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'schema.graphql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  providers: [...resolvers, ...loaders, ...services],
})
export class AppModule {}
