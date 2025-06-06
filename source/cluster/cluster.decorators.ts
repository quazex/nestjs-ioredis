import { Inject } from '@nestjs/common';
import { RedisClusterTokens } from './cluster.tokens';

export const InjectRedisCluster = (): ReturnType<typeof Inject> => {
    const token = RedisClusterTokens.getConnection();
    return Inject(token);
};
