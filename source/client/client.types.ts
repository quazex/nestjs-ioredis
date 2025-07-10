import { RedisOptions } from 'ioredis';

export interface RedisClientConfig extends RedisOptions {
    uri?: string;
}
