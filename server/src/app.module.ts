import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { MaterialEntity } from './entities';
import { MaterialResolver } from './resolvers';

const entities = [MaterialEntity];
const resolvers = [MaterialResolver];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
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
        await ds.runMigrations();

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
  providers: [...resolvers],
})
export class AppModule {}
