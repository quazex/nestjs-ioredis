import { ClusterNode, ClusterOptions } from 'ioredis';

export interface RedisClusterConfig {
    nodes: ClusterNode[];
    options?: ClusterOptions;
}
