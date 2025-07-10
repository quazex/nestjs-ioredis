import { DynamicModule, Global, Module, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedisClient } from './client.decorators';
import { RedisClientAsyncOptions } from './client.interfaces';
import { RedisClientProviders } from './client.providers';
import { RedisClientConfig } from './client.types';

@Global()
@Module({})
export class RedisClientModule implements OnModuleDestroy {
    constructor(@InjectRedisClient() private readonly client: Redis) {}

    public async onModuleDestroy(): Promise<void> {
        await this.client.quit();
    }

    public static forRoot(options: RedisClientConfig): DynamicModule {
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
