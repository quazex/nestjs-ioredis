import { Inject } from '@nestjs/common';
import { RedisClusterUtilities } from './cluster.utilities';

export const InjectRedisCluster = (name?: string): ReturnType<typeof Inject> => {
    const token = RedisClusterUtilities.getConnectionToken(name);
    return Inject(token);
};
