import { Inject } from '@nestjs/common';
import { RedisClientUtilities } from './client.utilities';

export const InjectRedisClient = (name?: string): ReturnType<typeof Inject> => {
    const token = RedisClientUtilities.getConnectionToken(name);
    return Inject(token);
};
