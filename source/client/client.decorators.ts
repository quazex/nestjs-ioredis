import { Inject } from '@nestjs/common';
import { RedisClientTokens } from './client.tokens';

export const InjectRedisClient = (): ReturnType<typeof Inject> => {
    const token = RedisClientTokens.getConnection();
    return Inject(token);
};
