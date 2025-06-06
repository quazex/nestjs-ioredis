import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { RedisClientAsyncOptions } from './client.interfaces';
import { RedisClientProviders } from './client.providers';

@Global()
@Module({})
export class RedisClientModule {
    public static forRoot(options: RedisOptions): DynamicModule {
        const optionsProvider = RedisClientProviders.getOptions(options);
        const clientProvider = RedisClientProviders.getClient();

        const dynamicModule: DynamicModule = {
            module: RedisClientModule,
            providers: [
                optionsProvider,
                clientProvider,
            ],
            exports: [
                clientProvider,
            ],
        };
        return dynamicModule;
    }


    public static forRootAsync(asyncOptions: RedisClientAsyncOptions): DynamicModule {
        const optionsProvider = RedisClientProviders.getAsyncOptions(asyncOptions);
        const clientProvider = RedisClientProviders.getClient();

        const dynamicModule: DynamicModule = {
            module: RedisClientModule,
            imports: asyncOptions.imports,
            providers: [
                optionsProvider,
                clientProvider,
            ],
            exports: [
                clientProvider,
            ],
        };

        return dynamicModule;
    }
}
