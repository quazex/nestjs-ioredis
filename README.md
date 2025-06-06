# NestJS ioredis module

Core features:

- Based on [official ioredis client for NodeJS](https://github.com/redis/ioredis);
- Includes standalone and cluster clients;
- Covered with unit and e2e tests;
- Basic module without unnecessary boilerplate.

## Installation

To install the package, run:

```sh
npm install @quazex/nestjs-ioredis ioredis
```

## Usage

### Importing the Module

To use the ioredis module in your NestJS application, import it into your root module (e.g., `AppModule`).

```typescript
import { Module } from '@nestjs/common';
import { RedisClientModule } from '@quazex/nestjs-ioredis';

@Module({
    imports: [
        RedisClientModule.forRoot({
            url: 'redis://localhost:6379/1',
        }),
    ],
})
export class AppModule {}
```

### Using ioredis Service

Once the module is registered, you can inject instance of the `Redis` or `Cluster` into your providers:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRedisClient } from '@quazex/nestjs-ioredis/client';
import { Redis } from 'ioredis';

@Injectable()
export class StorageService {
    constructor(@InjectRedisClient() private readonly client: Redis) {}

    async write(key: string, value: object) {
        await this.client.set(key, value);
    }

    async read(key: string) {
        return this.client.get(key);
    }
}
```

### Async Configuration

If you need dynamic configuration, use `forRootAsync`:

```typescript
@Module({
    imports: [
        RedisClientModule.forRootAsync({
            useFactory: async (config: SomeConfigProvider) => ({
                url: config.REDIS_URL,
            }),
            inject: [
                SomeConfigProvider,
            ],
        }),
    ],
})
export class AppModule {}
```

### Connection and graceful shutdown

By default, this module doesn't manage client connection on application bootstrap or shutdown. You can read more about lifecycle hooks on the NestJS [documentation page](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown).

```typescript
// main.ts
const app = await NestFactory.create(AppModule);

// Starts listening for shutdown hooks
app.enableShutdownHooks(); // <<<

await app.listen(process.env.PORT ?? 3000);
```

```typescript
// app.bootstrap.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { InjectRedisClient } from '@quazex/nestjs-ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class AppBootstrap implements OnApplicationShutdown {
    constructor(@InjectRedisClient() private readonly client: Client) {}

    public async onApplicationShutdown(): Promise<void> {
        await this.client.quit();
    }
}
```

## License

MIT

